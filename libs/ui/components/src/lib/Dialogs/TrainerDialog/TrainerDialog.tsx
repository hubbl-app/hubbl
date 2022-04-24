import { useEffect, useState } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import useSWR from 'swr';

import { useAppContext, useToastContext } from '@hubbl/data-access/contexts';
import { TrainerTagDTO } from '@hubbl/shared/models/dto';
import { Gender, SingleHandler } from '@hubbl/shared/types';
import { Save } from '@mui/icons-material';
import { Button, CircularProgress, Divider, Stack } from '@mui/material';

import Base, { BaseProps } from '../Base';
import DialogSection from '../DialogSection';
import {
  PersonEmail,
  PersonFirstName,
  PersonGender,
  PersonLastName
} from '../Person';
import { ParsedTrainerFormFields, TrainerFormFields } from '../types';
import TrainerTags from './TrainerTags';

export type TrainerDialogProps = {
  /**
   * Default values of the form
   *
   * @default undefined
   */
  defaultValues?: Partial<TrainerFormFields>;

  /**
   * Callback to run when the form has been successfully
   * submitted.
   *
   * @default undefined
   */
  onSubmit?: SingleHandler<ParsedTrainerFormFields>;
} & BaseProps;

const TrainerDialog = ({
  defaultValues,
  onSubmit,
  ...props
}: TrainerDialogProps): JSX.Element => {
  const {
    token,
    API: { fetcher }
  } = useAppContext();
  const { onError } = useToastContext();
  const { data, error } = useSWR<TrainerTagDTO[]>(
    token?.parsed && props.open ? '/tags/trainer' : null,
    fetcher,
    {
      revalidateOnMount: false
    }
  );

  const methods = useForm<TrainerFormFields>({
    defaultValues: {
      ...defaultValues,
      gender: defaultValues?.gender ?? Gender.OTHER,
      tags: []
    },
    shouldUnregister: true
  });

  const [idToTag, setIdToTag] = useState<Record<number, TrainerTagDTO>>({});

  const handleOnSubmit = (data: TrainerFormFields) => {
    // Parse the tags
    const parsedTags = data.tags.map((id) => idToTag[id]);

    onSubmit?.({
      ...data,
      tags: parsedTags
    });
  };

  if (error) {
    onError('An error occurred.');
  }

  useEffect(() => {
    if (!data) {
      return;
    }

    setIdToTag(data.reduce((prev, tag) => ({ ...prev, [tag.id]: tag }), {}));
  }, [data]);

  return (
    <Base {...props}>
      <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
        <FormProvider {...methods}>
          <DialogSection>
            <Stack gap={2}>
              <Stack
                direction={{
                  xs: 'column',
                  sm: 'column',
                  md: 'row',
                  lg: 'row',
                  xl: 'row'
                }}
                width="100%"
                gap={2}
              >
                <PersonFirstName />

                <PersonLastName />
              </Stack>

              <PersonEmail />

              <PersonGender />
            </Stack>
          </DialogSection>

          <Divider />

          <DialogSection>
            <TrainerTags tags={data} />
          </DialogSection>

          <Divider />

          <DialogSection footer>
            <Stack direction="row" justifyContent="flex-end">
              {data?.length === undefined && <CircularProgress />}

              <Button type="submit" title="submit" startIcon={<Save />}>
                Save
              </Button>
            </Stack>
          </DialogSection>
        </FormProvider>
      </form>
    </Base>
  );
};

export default TrainerDialog;
