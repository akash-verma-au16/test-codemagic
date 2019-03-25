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
import Settings from "../Settings";
import ListSurvey from '../ListSurvey'
/* This stack will contain list of all pages */
const RootStack = createStackNavigator(
    {
        
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

        'listSurvey': {
            screen: ListSurvey,
            navigationOptions: {
                headerStyle: {
                    backgroundColor: '#1c92c4'
                },
                title: 'Surveys',
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                    textAlign:"center",
                    flex: 1
                }
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

