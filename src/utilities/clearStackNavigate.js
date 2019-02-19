/* This Utility will clear navigation stack and then navigate to the specified page */
/* This will restrict the access of pages using back button on android */
import {StackActions,NavigationActions} from 'react-navigation'
export default (page,props) =>{
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: page })]
    });
    props.navigation.dispatch(resetAction);
}