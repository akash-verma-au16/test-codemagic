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
/* This stack will contain list of all pages */
const RootStack = createStackNavigator(
    {
        'Profile': {
            screen: Home,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#1c92c4'
                },
                title: 'Profile',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign:"center",
                    flex: 1
                }
            }
        },

        'LoginPage': {
            screen: LoginPage,
            navigationOptions: {
                header:null
            }
        },
        
        'ForgotPassword': {
            screen: ForgotPassword,
            navigationOptions: {
                header:null
            }
        },
        
        'ConfirmPassword': {
            screen: ConfirmPassword,
            navigationOptions: {
                header:null
            }
        },
        
        'TermsAndConditions': {
            screen: TermsAndConditions,
            navigationOptions: {
                header:null
            }
        },
        
        'SurveyIntro': {
            screen: SurveyIntro,
            navigationOptions: {
                header:null
            }
        },
        
        'SurveyExit': {
            screen: SurveyExit,
            navigationOptions: {
                header:null
            }
        },
        
        'QuestionContainer': {
            screen: QuestionContainer,
            navigationOptions: {
                header:null
            }
        },
        'InAppNotifier': {
            screen: InAppNotifier,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#1c92c4'
                },
                title: 'YOUR NOTIFICATIONS',
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
                header:null
            }
        },
        
        'TabNavigator': {
            screen: TabNavigator,
            navigationOptions: {
                header:null
            }
        },

        'settings': {
            screen: Settings,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#1c92c4'
                },
                title: 'Settings',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign:"center",
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

