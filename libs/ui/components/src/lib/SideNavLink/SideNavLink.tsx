import { motion, MotionProps } from 'framer-motion';
import Link from 'next/link';

import {
  alpha,
  Breakpoint,
  ListItem,
  ListItemProps,
  styled,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

import ContentCard from '../ContentCard';

const UnselectedLink = styled(Typography)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.text.primary
}));

const Unselected = styled(ListItem)<MotionProps & ListItemProps>(
  ({ theme }) => ({
    listStyle: 'none',
    height: theme.spacing(7),
    paddingLeft: theme.spacing(3),
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'
  })
);

const Selected = styled(ContentCard)(({ theme }) => ({
  height: theme.spacing(7),
  paddingLeft: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  borderRadius: theme.spacing(1)
}));

export type SideNavLinkItem = {
  /**
   * Breakpoint in which the side nav link is shrink
   *
   * @default 'lg'
   */
  breakpoint?: Breakpoint;

  /**
   * Label of the link to display
   */
  label: string;

  /**
   * Href of the link, when clicking on it and the item
   * is not selected
   */
  href: string;
};

type SideNavLinkProps = {
  /**
   * Wether it should display a selected or an unselected
   * item
   */
  selected?: boolean;
} & SideNavLinkItem;

const SideNavLink = ({
  breakpoint = 'lg',
  href,
  label,
  selected = false
}: SideNavLinkProps): JSX.Element => {
  const theme = useTheme();
  const shrink = useMediaQuery(theme.breakpoints.down(breakpoint));

  return selected ? (
    <Selected role="listitem">
      <Typography> {shrink ? label[0].toUpperCase() : label}</Typography>
    </Selected>
  ) : (
    <Unselected
      as={motion.li}
      initial={{
        backgroundColor: alpha('#FFF', 0),
        boxShadow: theme.shadows[1],
        borderRadius: theme.spacing(1)
      }}
      whileHover={{ backgroundColor: '#FFF', boxShadow: theme.shadows[2] }}
      transition={{ type: 'spring', stiffness: 700, damping: 50 }}
      role="listitem"
    >
      <Link href={href} passHref>
        <UnselectedLink as="a">
          {shrink ? label[0].toUpperCase() : label}
        </UnselectedLink>
      </Link>
    </Unselected>
  );
};

export default SideNavLink;
