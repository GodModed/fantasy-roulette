import { StackNavigationList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { GENERAL_STATE, SCREEN } from "common/types";


export default function navigate(
	navigation: StackNavigationList,
	screen: SCREEN,
	state: GENERAL_STATE
) {
	navigation.reset({
		index: 0,
		routes: [{
			name: screen,
			params: state
		}]
	});
}