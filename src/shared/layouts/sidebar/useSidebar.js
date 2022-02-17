import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveUser } from "redux/actions";
import { ReactComponent as DiscussionIcon } from 'assets/icons/ic-discuss.svg';
import { ReactComponent as VotesIcon } from 'assets/icons/ic-vote.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/ic-plus.svg';
import { ReactComponent as UsersIcon } from 'assets/icons/ic-users.svg';
import { ReactComponent as SettingIcon } from 'assets/icons/ic-setting.svg';
import { ReactComponent as LogoutIcon } from 'assets/icons/ic-logout.svg';
import { ReactComponent as HomeIcon } from 'assets/icons/ic-home.svg';
import { ReactComponent as GrantIcon } from 'assets/icons/ic-grant.svg';
import { ReactComponent as DocIcon } from 'assets/icons/ic-alldoc.svg';
import { ReactComponent as DirectoryIcon } from 'assets/icons/ic-directory.svg';
import { ReactComponent as MilestoneIcon } from 'assets/icons/ic-milestone.svg';
import { ReactComponent as SurveyIcon } from 'assets/icons/ic-survey.svg';
import { ReactComponent as GlobalIcon } from 'assets/icons/ic-global.svg';
import { ReactComponent as EmailerIcon } from 'assets/icons/ic-emailer.svg';
import { ReactComponent as ReportIcon } from 'assets/icons/ic-report.svg';
import { ReactComponent as AccountingIcon } from 'assets/icons/ic-accounting.svg';
import { ReactComponent as TeamIcon } from 'assets/icons/ic-team.svg';
import { ReactComponent as RepIcon } from 'assets/icons/ic-rep.svg';

import Helper from "utils/Helper";

export const useSidebar = () => {
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector(state => state.global.authUser);

  useEffect(() => {
    if (user?.is_admin) {
      setItems([
        {
          key: 'dashboard',
          icon: HomeIcon,
          label: 'Dashboard',
          action: {
            to: '/app',
          }
        },
        {
          key: 'discussion',
          icon: DiscussionIcon,
          label: 'Discussions',
          action: {
            to: '/app/discussions',
          }
        },
        {
          key: 'votes',
          icon: VotesIcon,
          label: 'Votes',
          action: {
            to:  '/app/votes', 
          }
        },
        {
          key: 'proposals',
          icon: PlusIcon,
          label: 'Proposals',
          action: {
            to:  '/app/proposals', 
          }
        },
        {
          key: 'all-proposals',
          icon: DocIcon,
          label: 'All Proposals',
          action: {
            to:  '/app/all-proposals', 
          }
        },
        {
          key: 'setting',
          icon: SettingIcon,
          label: 'Settings',
          action: {
            to: '/app/settings',
          }
        },
        {
          key: 'admin-tool',
          icon: null,
          label: 'Admin Tools',
          action: {
            onClick: () => {}
          } 
        },
        {
          key: 'portal-users',
          icon: UsersIcon,
          label: 'Portal Users',
          action: {
            to: '/app/users',
          }
        },
        {
          key: 'va-directory',
          icon: DirectoryIcon,
          label: 'VA Directory',
          action: {
            to: '/app/va-directory',
          }
        },
        {
          key: 'new-proposals',
          icon: PlusIcon,
          label: 'New Proposals',
          action: {
            to: '/app/new-proposals',
          }
        },
        {
          key: 'to-formal',
          icon: UsersIcon,
          label: 'Move to Formal',
          action: {
            to: '/app/to-formal',
          }
        },
        {
          key: 'grants',
          icon: GrantIcon,
          label: 'Grants',
          action: {
            to: '/app/grants',
          }
        },
        {
          key: 'milestones',
          icon: MilestoneIcon,
          label: 'Milestones',
          action: {
            to: '/app/milestones',
          }
        },
        {
          key: 'surveys',
          icon: SurveyIcon,
          label: 'Surveys',
          action: {
            to: '/app/surveys',
          }
        },
        {
          key: 'global-settings',
          icon: GlobalIcon,
          label: 'Global Settings',
          action: {
            to: '/app/global-settings',
          }
        },
        {
          key: 'teams',
          icon: TeamIcon,
          label: 'Teams',
          action: {
            to: '/app/admin-team',
          }
        },
        {
          key: 'accounting',
          icon: AccountingIcon,
          label: 'Accounting',
          action: {
            to: '/app/accounting',
          }
        },
        {
          key: 'report',
          icon: ReportIcon,
          label: 'Report',
          action: {
            to: '/app/report',
          }
        },
        {
          key: 'emailer',
          icon: EmailerIcon,
          label: 'Emailer',
          action: {
            to: '/app/emailer',
          }
        },
        {
          key: 'logout',
          icon: LogoutIcon,
          label: 'Sign Out',
          action: {
            onClick: () => logout()
          } 
        },
      ]);
    } else if (user?.is_member) {
      setItems([
        {
          key: 'dashboard',
          icon: HomeIcon,
          label: 'Dashboard',
          action: {
            to: '/app',
          }
        },
        {
          key: 'discussion',
          icon: DiscussionIcon,
          label: 'Discussions',
          action: {
            to: '/app/discussions',
          }
        },
        {
          key: 'votes',
          icon: VotesIcon,
          label: 'Votes',
          action: {
            to:  '/app/votes', 
          }
        },
        {
          key: 'user-surveys',
          icon: SurveyIcon,
          label: 'Surveys',
          action: {
            to: '/app/user-surveys',
          }
        },
        {
          key: 'proposals',
          icon: PlusIcon,
          label: 'My Proposals',
          action: {
            to:  '/app/proposals', 
          }
        },
        {
          key: 'all-proposals',
          icon: DocIcon,
          label: 'All Proposals',
          action: {
            to:  '/app/all-proposals', 
          }
        },
        {
          key: 'reputation',
          icon: RepIcon,
          label: 'Reputation',
          action: {
            to:  '/app/reputation', 
          }
        },
        {
          key: 'grants',
          icon: GrantIcon,
          label: 'Grants',
          action: {
            to: '/app/grants',
          }
        },
        {
          key: 'va-directory',
          icon: DirectoryIcon,
          label: 'VA Directory',
          action: {
            to: '/app/va-directory',
          }
        },
        {
          key: 'setting',
          icon: SettingIcon,
          label: 'Settings',
          action: {
            to: '/app/settings',
          }
        },
        {
          key: 'logout',
          icon: LogoutIcon,
          label: 'Sign Out',
          action: {
            onClick: () => logout()
          } 
        },
      ]);
    } else if (user?.is_guest) {
      setItems([
        {
          key: 'dashboard',
          icon: HomeIcon,
          label: 'Dashboard',
          action: {
            to: '/app',
          }
        },
        {
          key: 'discussion',
          icon: DiscussionIcon,
          label: 'Discussions',
          action: {
            to: '/app/discussions',
          }
        },
        {
          key: 'votes',
          icon: VotesIcon,
          label: 'Votes',
          action: {
            to:  '/app/votes', 
          }
        },
        {
          key: 'logout',
          icon: LogoutIcon,
          label: 'Sign Out',
          action: {
            onClick: () => logout()
          } 
        }
      ])
    } else {
      setItems([
        {
          key: 'dashboard',
          icon: HomeIcon,
          label: 'Dashboard',
          action: {
            to: '/app',
          }
        },
        {
          key: 'discussion',
          icon: DiscussionIcon,
          label: 'Discussions',
          action: {
            to: '/app/discussions',
          }
        },
        {
          key: 'votes',
          icon: VotesIcon,
          label: 'Votes',
          action: {
            to:  '/app/votes', 
          }
        },
        {
          key: 'proposals',
          icon: PlusIcon,
          label: 'Proposals',
          action: {
            to:  '/app/proposals', 
          }
        },
        {
          key: 'all-proposals',
          icon: DocIcon,
          label: 'All Proposals',
          action: {
            to:  '/app/all-proposals', 
          }
        },
        {
          key: 'reputation',
          icon: RepIcon,
          label: 'Reputation',
          action: {
            to:  '/app/reputation', 
          }
        },
        {
          key: 'grants',
          icon: GrantIcon,
          label: 'Grants',
          action: {
            to: '/app/grants',
          }
        },
        {
          key: 'setting',
          icon: SettingIcon,
          label: 'Settings',
          action: {
            to: '/app/settings',
          }
        },
        {
          key: 'logout',
          icon: LogoutIcon,
          label: 'Sign Out',
          action: {
            onClick: () => logout()
          } 
        },
      ]);
    }
  }, [user]);

  const logout = (e) => {
    Helper.storeUser({});
    dispatch(saveUser({}));
  };

  return { items };
}