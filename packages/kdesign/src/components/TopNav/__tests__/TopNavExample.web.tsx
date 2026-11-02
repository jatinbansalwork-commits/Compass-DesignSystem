import { TopNav, TopNavActions, TopNavBrand, TopNavContent } from '../TopNav';
import { Avatar } from '~components/Avatar';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { ActivityIcon, AnnouncementIcon } from '~components/Icons';
import { TopNavBrandLogoPlaceholder } from '../docs/TopNavBrandLogoPlaceholder';
import { Tooltip } from '~components/Tooltip';

const TopNavExample = (): React.ReactElement => {
  return (
    <Box height="100vh" backgroundColor="surface.background.gray.intense">
      <TopNav
        variant="primary"
        data-analytics-topnav="demo"
        testID="demo"
      >
        <TopNavBrand>
          <TopNavBrandLogoPlaceholder />
        </TopNavBrand>
        <TopNavContent>{null}</TopNavContent>
        <TopNavActions>
          <Tooltip content="View Ecosystem Health">
            <Button
              size="medium"
              variant="tertiary"
              icon={ActivityIcon}
              accessibilityLabel="View Ecosystem Health"
            />
          </Tooltip>
          <Tooltip content="View Announcements">
            <Button
              variant="tertiary"
              icon={AnnouncementIcon}
              accessibilityLabel="View Announcements"
            />
          </Tooltip>
          <Avatar size="medium" name="Jordan Brooks" />
        </TopNavActions>
      </TopNav>
    </Box>
  );
};

export { TopNavExample };
