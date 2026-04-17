'use server';

import { secret } from '@/config/secret';

import { ReportAppPayload } from '@/lib/schemas';

export async function createReport(data: ReportAppPayload) {
  const res = await fetch(`${secret.apiBaseUrl}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...data,
    }),
  });

  return await res.json();
}
