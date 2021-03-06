import { useFormContext } from 'react-hook-form';

import Input from '../../../Input';
import { CalendarEventFormFields } from '../../types';

const CalendarEventName = (): JSX.Element => {
  const {
    register,
    formState: { errors },
    watch
  } = useFormContext<CalendarEventFormFields>();

  return (
    <Input
      label="Calendar event name"
      title="calendar-event-name"
      placeholder="New name"
      type="text"
      registerResult={register('name', { required: true })}
      error={!!errors.name}
      disabled={!!watch('template')}
      fullWidth
    />
  );
};

export default CalendarEventName;
