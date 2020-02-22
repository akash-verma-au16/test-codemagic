import { createStackNavigator, createAppContainer } from 'react-navigation';

/* Page Containers */
import LoginPage from '../LoginPage'
import ForgotPassword from '../ForgotPassword'
import ConfirmPassword from '../ConfirmPassword'
import TermsAndConditions from '../TermsAndConditions'
import SurveyIntro from '../SurveyIntro'
import SurveyExit from '../SurveyExit'
import QuestionContainer from '../QuestionContainer'
import ForceChangePassword from '../ForceChangePassword'
import TabNavigator from '../TabNavigator'
import Settings from "../Settings"
import Home from '../Home'
import InAppNotifier from '../InAppNotifier/index'
import Likes from '../Likes/index'
import Comments from '../Comments/index'
import EditPost from '../EditPost/index'
import EditComment from '../EditComment/index'
import ReadPost from '../ReadPost'
import StrengthPosts from '../StrengthPosts'
import DetailedInsights from '../DetailedInsights'
import Welcome from '../WelcomeScreen/index'
import Feedback from '../Feedback/index'
import ChangePassword from '../ChangePassword'
/* This stack will contain list of all pages */
const RootStack = createStackNavigator(
    {
        'Profile': {
            screen: Home,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C'
                },
                title: 'Profile',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign: "center",
                    flex: 1
                }
            }
        },

        'LoginPage': {
            screen: LoginPage,
            navigationOptions: {
                header: null
            }
        },

        'ForgotPassword': {
            screen: ForgotPassword,
            navigationOptions: {
                header: null
            }
        },

        'ConfirmPassword': {
            screen: ConfirmPassword,
            navigationOptions: {
                header: null
            }
        },

        'TermsAndConditions': {
            screen: TermsAndConditions,
            navigationOptions: {
                header: null
            }
        },

        'SurveyIntro': {
            screen: SurveyIntro,
            navigationOptions: {
                header: null
            }
        },

        'SurveyExit': {
            screen: SurveyExit,
            path: 'SurveyExit',
            navigationOptions: {
                header: null
            }
        },

        'QuestionContainer': {
            screen: QuestionContainer,
            navigationOptions: {
                header: null
            }
        },
        'InAppNotifier': {
            screen: InAppNotifier,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C'
                },
                title: 'Notifications',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },
        'Likes': {
            screen: Likes,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C',
                    height: 41
                },
                title: 'People Who Liked',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },
        'Comments': {
            screen: Comments,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C',
                    height: 40
                },
                title: 'Comments',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },
        'EditPost': {
            screen: EditPost,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C',
                    height: 40
                },
                title: 'Edit Post',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },
        'DetailedInsights': {
            screen: DetailedInsights,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C',
                    height: 40
                },
                title: 'Detailed Insights',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },
        'StrengthPosts': {
            screen: StrengthPosts,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C',
                    height: 40
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },
        'ReadPost': {
            screen: ReadPost,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C'
                },
                title: 'Your tagged post',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign: "center",
                    flex: 1
                }
            }
        },
        'EditComment': {
            screen: EditComment,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C',
                    height: 40
                },
                title: 'Edit Comment',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    fontSize: 19,
                    fontFamily: 'OpenSans-Regular'
                }
            }
        },

        'ForceChangePassword': {
            screen: ForceChangePassword,
            navigationOptions: {
                header: null
            }
        },
        'Welcome': {
            screen: Welcome,
            navigationOptions: {
                header: null
            }
        },
        'TabNavigator': {
            screen: TabNavigator,
            navigationOptions: {
                header: null
            }
        },

        'settings': {
            screen: Settings,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C'
                },
                title: 'Settings',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign: "center",
                    flex: 1
                }
            }
        },
        'Feedback': {
            screen: Feedback,
            navigationOptions: {
                header: null
            }
        },
        'ChangePassword': {
            screen: ChangePassword,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#47309C'
                },
                title: 'Change Password',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    flex: 1
                }
            }
        }
    },
    {
        initialRouteName: 'TabNavigator'

    }
);

export default createAppContainer(RootStack);

