import { secret } from '@/config/secret';

// ─── Types ────────────────────────────────────────────────────────────────────

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiClientOptions<TBody = unknown> {
  url: string;
  method?: HttpMethod;
  data?: TBody;
  /** Query params — undefined/null values are omitted automatically */
  params?: Record<string, string | number | boolean | undefined | null>;
  headers?: Record<string, string>;
  cache?: RequestCache;
  /** Next.js ISR revalidate in seconds. 0 = always fresh. false = no revalidation. */
  revalidate?: number | false;
  /** Next.js on-demand revalidation tags */
  tags?: string[];
}

// ─── ANSI colors (terminal only — stripped automatically in non-TTY) ──────────

const c = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // foreground
  white: '\x1b[97m',
  black: '\x1b[30m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',

  // background
  bgCyan: '\x1b[46m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgRed: '\x1b[41m',
  bgMagenta: '\x1b[45m',
  bgBlue: '\x1b[44m',
  bgGray: '\x1b[100m',
} as const;

// ─── Method badge ─────────────────────────────────────────────────────────────

function methodBadge(method: string): string {
  const map: Record<string, string> = {
    GET: `${c.bgCyan}${c.black}`,
    POST: `${c.bgGreen}${c.black}`,
    PUT: `${c.bgBlue}${c.white}`,
    PATCH: `${c.bgMagenta}${c.white}`,
    DELETE: `${c.bgRed}${c.white}`,
  };
  const bg = map[method] ?? `${c.bgGray}${c.white}`;
  const padded = ` ${method.padEnd(6)} `;
  return `${c.bold}${bg}${padded}${c.reset}`;
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function statusBadge(status: number): string {
  const bg =
    status >= 500
      ? `${c.bgRed}${c.white}`
      : status >= 400
        ? `${c.bgYellow}${c.black}`
        : status >= 300
          ? `${c.bgCyan}${c.black}`
          : `${c.bgGreen}${c.black}`;
  return `${c.bold}${bg} ${status} ${c.reset}`;
}

// ─── Dev Logger ───────────────────────────────────────────────────────────────

function devLog(method: string, url: string, status: number, ms: number): void {
  if (process.env.NODE_ENV !== 'development') return;

  const timing =
    ms > 1000
      ? `${c.red}${c.bold}${ms}ms${c.reset}`
      : ms > 300
        ? `${c.yellow}${ms}ms${c.reset}`
        : `${c.green}${ms}ms${c.reset}`;

  console.log(
    [
      '',
      `  ${methodBadge(method)} ${statusBadge(status)} ${c.dim}${timing}`,
      `  ${c.cyan}${c.bold}⇡ api - ${c.reset}${c.white}${url}${c.reset}`,
      '',
    ].join('\n')
  );
}

function devError(method: string, url: string, err: unknown): void {
  if (process.env.NODE_ENV !== 'development') return;
  const message = err instanceof Error ? err.message : String(err);

  console.error(
    [
      '',
      `  ${methodBadge(method)} ${c.bgRed}${c.white}${c.bold} ERROR ${c.reset}`,
      `  ${c.cyan}${c.bold}⇡ api - ${c.reset}${c.white}${url}${c.reset}`,
      `  ${c.red}${c.bold}✖ error   ${c.reset}${c.red}${message}${c.reset}`,
      '',
    ].join('\n')
  );
}

// ─── Core Client ──────────────────────────────────────────────────────────────

export async function apiClient<TResponse, TBody = unknown>({
  url,
  method = 'GET',
  data,
  params,
  headers = {},
  cache = 'default',
  revalidate = 60, // seconds
  tags,
}: ApiClientOptions<TBody>): Promise<TResponse> {
  const qs = params
    ? '?' +
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(
          ([k, v]) =>
            `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`
        )
        .join('&')
    : '';

  const fullUrl = `${secret.apiBaseUrl}${url}${qs}`;

  const init: RequestInit = {
    method,
    cache,
    next: {
      revalidate,
      ...(tags?.length ? { tags } : {}),
    },
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  };

  const t0 = performance.now();
  let res: Response;

  try {
    res = await fetch(fullUrl, init);
  } catch (err) {
    devError(method, fullUrl, err);
    throw new Error(
      `Network error — ${method} ${fullUrl}: ${(err as Error).message}`
    );
  }

  devLog(method, fullUrl, res.status, +(performance.now() - t0).toFixed(2));

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(
      `${res.status} ${res.statusText} — ${fullUrl}${body ? `: ${body}` : ''}`
    );
  }

  return res.json() as Promise<TResponse>;
}

// ─── Convenience Wrappers ─────────────────────────────────────────────────────

type Opts<TBody> = Omit<ApiClientOptions<TBody>, 'url' | 'method' | 'data'>;

export const fetchGet = <TRes>(url: string, opts?: Opts<never>) =>
  apiClient<TRes>({ url, method: 'GET', ...opts });

export const fetchPost = <TRes, TBody = unknown>(
  url: string,
  data?: TBody,
  opts?: Opts<TBody>
) => apiClient<TRes, TBody>({ url, method: 'POST', data, ...opts });

export const fetchPut = <TRes, TBody = unknown>(
  url: string,
  data?: TBody,
  opts?: Opts<TBody>
) => apiClient<TRes, TBody>({ url, method: 'PUT', data, ...opts });

export const fetchPatch = <TRes, TBody = unknown>(
  url: string,
  data?: TBody,
  opts?: Opts<TBody>
) => apiClient<TRes, TBody>({ url, method: 'PATCH', data, ...opts });

export const fetchDelete = <TRes>(url: string, opts?: Opts<never>) =>
  apiClient<TRes>({ url, method: 'DELETE', ...opts });
