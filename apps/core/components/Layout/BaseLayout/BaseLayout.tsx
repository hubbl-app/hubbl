import React, { useState } from 'react';

import {
  ContentContainer,
  HeaderNavWrapper,
  SideNavWrapper
} from '@hubbl/ui/components';
import { notForwardOne } from '@hubbl/utils';
import { Menu } from '@mui/icons-material';
import {
  alpha,
  Box,
  IconButton,
  Stack,
  styled,
  useMediaQuery,
  useTheme
} from '@mui/material';

import CoreSideNav, { CoreSideNavProps } from '../CoreSideNav';

type MainContentContainerProps = {
  /**
   * If set to true, increases the top padding
   *
   * @default false
   */
  topBar?: boolean;
};

const MainContentContainer = styled(Box, {
  shouldForwardProp: notForwardOne('topBar')
})<MainContentContainerProps>(({ theme, topBar }) => ({
  overflow: 'auto',
  width: '100%',
  padding: theme.spacing(topBar ? 8 : 4, 4, 4),
  transition: theme.transitions.create(['padding']),
  [theme.breakpoints.down('lg')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3)
  },
  [theme.breakpoints.down('md')]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2)
  },
  [theme.breakpoints.down('sm')]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1)
  }
}));

type ContentStackProps = {
  /**
   * Whether the layout is width limited or fully expanded
   *
   * @default false
   */
  expanded?: boolean;
};

const ContentStack = styled(Stack, {
  shouldForwardProp: notForwardOne('expanded')
})<ContentStackProps>(({ theme, expanded }) => ({
  maxWidth: expanded ? undefined : theme.spacing(140)
}));

const TopNavBar = styled(Stack)(({ theme }) => ({
  backgroundColor: alpha('#FFF', 0.7),
  backdropFilter: `blur(${theme.spacing(2.5)})`,
  padding: theme.spacing(1, 2)
}));

type BaseLayoutProps = {
  children?: React.ReactNode;
} & ContentStackProps &
  CoreSideNavProps;

const BaseLayout = ({
  children,
  expanded,
  header,
  selected
}: BaseLayoutProps) => {
  const theme = useTheme();
  const hideSideNav = useMediaQuery(theme.breakpoints.down('md'));

  const [toggleNavBar, setToggleNavBar] = useState(false);

  const handleOnToggleNavBar = () => {
    setToggleNavBar((prev) => !prev);
  };

  return (
    <>
      <HeaderNavWrapper hidden={hideSideNav}>
        <TopNavBar
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <IconButton onClick={handleOnToggleNavBar}>
            <Menu />
          </IconButton>
        </TopNavBar>
      </HeaderNavWrapper>

      <ContentContainer>
        <SideNavWrapper
          hidden={hideSideNav && !toggleNavBar}
          toggled={hideSideNav && toggleNavBar}
        >
          <CoreSideNav header={header} selected={selected} />
        </SideNavWrapper>

        <MainContentContainer topBar={hideSideNav}>
          <ContentStack direction="column" gap={3} expanded={expanded}>
            {children}
          </ContentStack>
        </MainContentContainer>
      </ContentContainer>
    </>
  );
};

export default BaseLayout;
