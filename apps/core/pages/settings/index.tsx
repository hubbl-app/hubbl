import { ReactElement } from 'react';

import { useRouter } from 'next/router';

import { useAppContext } from '@hubbl/data-access/contexts';
import {
  PageHeader,
  RequiredUserInfoFields,
  SettingsLogout,
  SettingsUserInfo,
  SettingsUserPassword,
  UserPasswordFields
} from '@hubbl/ui/components';

import { BaseLayout, Pages, SettingsPages } from '../../components';

const { SettingsGymInfo } = Pages.Settings;

const Settings = () => {
  const router = useRouter();
  const {
    token: { parsed },
    user,
    API
  } = useAppContext();

  const mapUserToValues = (): RequiredUserInfoFields => {
    if (!user) {
      return undefined;
    }

    return {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      gender: user.gender
    };
  };

  /**
   * Since we can ensure that, if the prop `parsed` is `undefined`
   * there's no user, we do not have to return undefined as in
   * `mapUserToValues` if such user is `undefined`
   */
  const mapGymToValues = (): Pages.Settings.RequiredGymInfoFields => ({
    name: user.gym.name,
    email: user.gym.email,
    phone: user.gym.phone,
    color: user.gym.color
  });

  const handleOnUpdateUser = (
    data: RequiredUserInfoFields | UserPasswordFields
  ) => {
    API.user.update(data);
  };

  const handleOnUpdateGym = (data: Pages.Settings.RequiredGymInfoFields) => {
    API.gym.update(data);
  };

  const handleOnLogOut = async () => {
    await API.logout();
    router.push('/auth/login');
  };

  return (
    <>
      <PageHeader
        title="Settings"
        breadcrumbs={[{ href: '/', label: 'Settings' }]}
      />

      <SettingsLogout
        header="User full name"
        subtitle="Gym owner"
        onLogOut={handleOnLogOut}
      />

      <SettingsUserInfo
        defaultValues={mapUserToValues()}
        onSubmit={handleOnUpdateUser}
      />

      <SettingsUserPassword onSubmit={handleOnUpdateUser} />

      {parsed?.user === 'owner' && (
        <SettingsGymInfo
          defaultValues={mapGymToValues()}
          onSubmit={handleOnUpdateGym}
        />
      )}
    </>
  );
};

export default Settings;

Settings.getLayout = (page: ReactElement) => (
  <SettingsPages>
    <BaseLayout header="Gym name" selected="settings">
      {page}
    </BaseLayout>
  </SettingsPages>
);
