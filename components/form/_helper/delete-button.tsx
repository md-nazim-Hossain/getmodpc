import { X } from 'lucide-react';

import { Button, type ButtonProps } from '@/components/ui/button';

const DeleteButton: React.FC<Pick<ButtonProps, 'onClick' | 'disabled'>> = ({
  onClick,
  disabled = false,
}) => {
  return (
    <Button
      disabled={disabled}
      type='button'
      variant={'destructive'}
      size={'icon'}
      className='shadow-none'
      onClick={onClick}
    >
      <X className='size-5 ' />
    </Button>
  );
};

export default DeleteButton;
