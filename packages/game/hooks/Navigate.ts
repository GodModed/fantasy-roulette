import { useNavigation } from "@react-navigation/native";
import { SCREEN } from "common/types";


export function useNavigate() {
	const navigation = useNavigation();

	return (screen: SCREEN) => {
		navigation.reset({
			index: 0,
			routes: [{ name: screen }]
		});
	};
}