import {
  Typography,
  styled,
  useMediaQuery,
  Theme,
  Breakpoint
} from '@mui/material';
import SideNavLink, { SideNavLinkItem } from '../SideNavLink';

const HeaderListItem = styled('li')({ listStyle: 'none' });

export type SideNavGroupItem = {
  /**
   * Breakpoint in which the side nav group is shrink
   *
   * @default 'lg'
   */
  breakpoint?: Breakpoint;

  /**
   * Entries of the group
   */
  entries: Record<string, SideNavLinkItem>;

  /**
   * Whether the group title should be hidden or shown
   */
  hidden?: boolean;

  /**
   * Name of the group, which will be displayed. If no name is given,
   * nothing will be displayed
   */
  name?: string;
};

type SideNavGroupProps = {
  /**
   * Value of the {@link SideNavLinkItem.label} that is selected
   */
  selected: string;
} & SideNavGroupItem;

const SideNavGroup = ({
  breakpoint = 'lg',
  entries,
  hidden = false,
  name,
  selected
}: SideNavGroupProps): JSX.Element => {
  const shrink = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down(breakpoint)
  );

  return (
    <>
      {!hidden && name && (
        <HeaderListItem>
          <Typography variant="h6">
            {shrink ? name[0].toUpperCase() : name}
          </Typography>
        </HeaderListItem>
      )}

      {Object.entries(entries).map(([entry, { label, href }]) => (
        <SideNavLink
          key={entry}
          breakpoint={breakpoint}
          label={label}
          href={href}
          selected={entry === selected}
        />
      ))}
    </>
  );
};

export default SideNavGroup;
