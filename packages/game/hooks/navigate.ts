import { StackNavigationList } from "@/App";
import { useNavigation } from "@react-navigation/native";
import { GENERAL_STATE, SCREEN } from "common/types";


export default function navigate(
	navigation: any,
	screen: SCREEN,
	state: GENERAL_STATE
) {
	navigation = navigation as ReturnType<typeof useNavigation<StackNavigationList>>
	navigation.reset({
		index: 0,
		routes: [{
			name: screen,
			params: state
		}]
	});
}