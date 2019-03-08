import { createStackNavigator, createAppContainer } from 'react-navigation';

/* Page Containers */
import LoginPage from '../LoginPage'
import ForgotPassword from '../ForgotPassword'
import Home from '../Home'
import ConfirmPassword from '../ConfirmPassword'
import TermsAndConditions from '../TermsAndConditions'
import SurveyIntro from '../SurveyIntro'
import SurveyExit from '../SurveyExit'
import QuestionContainer from '../QuestionContainer'
import ForceChangePassword from '../ForceChangePassword'
import CreatePost from '../CreatePost'
import TabNavigator from '../TabNavigator'
/* This stack will contain list of all pages */
const RootStack = createStackNavigator(
    {
        Home,
        LoginPage,
        ForgotPassword,
        ConfirmPassword,
        TermsAndConditions,
        SurveyIntro,
        SurveyExit,
        QuestionContainer,
        ForceChangePassword,
        CreatePost,
        TabNavigator
    },
    {
        initialRouteName: 'TabNavigator',
        defaultNavigationOptions: { /* Applied Header styles to all Component in RootStack */
            header: null
        }
    }
);

export default createAppContainer(RootStack);

