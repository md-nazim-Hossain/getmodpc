import { PaginationMeta } from '@/types';

const Pagination: React.FC<PaginationMeta> = ({
  hasNextPage,
  hasPreviousPage,
  limit,
  page,
  total,
  totalPages,
}) => {
  return (
    <div className='gm__pagination-wrapper'>
      {Array.from({ length: totalPages }, (_, index) => {
        return (
          <div key={index} className='gm__pagination-item'>
            <input
              checked={page === index + 1}
              id={'pagination-item-' + index}
              name={'pagination-item-' + index}
              value={index + 1}
              type='radio'
            />
            <label htmlFor={'pagination-item-' + index}>
              <span>{index + 1}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default Pagination;
