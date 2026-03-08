import { useEffect, useState } from "react";
import { Text } from "react-native";
import { Box } from "../components/ui/box";
import { Input, InputField } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { API } from "@/hooks/API";
import { useNavigate } from "@/hooks/Navigate";
import useGameState from "@/hooks/GameStore";

export default function Join() {

	const navigate = useNavigate();
	const { game, client, setClientOptions } = useGameState();

	const [code, setCode] = useState<string>("");
	const [name, setName] = useState<string>(client.name);
	const [waiting, setWaiting] = useState<boolean>(false);

	useEffect(() => {
		setClientOptions({
			online: true,
			host: false
		})
	}, [])

	useEffect(() => {
		if (game.started && waiting) {
			navigate("GAME");
		}
	}, [game.started, waiting])

	async function onClick() {
		const isIn = await API.join(code, name);

		if (isIn) {
			setWaiting(true);
			setClientOptions({
				code,
				name
			});
		}
		else setWaiting(false);
	}

	return (
		<>
			<Box className="flex-column p-4 items-center">
				<Input className="m-4">
					<InputField className="text-white" value={code} onChangeText={setCode} placeholder="Code"></InputField>
				</Input>

				<Input className="m-4">
					<InputField className="text-white" value={name} onChangeText={setName} placeholder="Name"></InputField>
				</Input>

				<Button className="m-4" onPress={onClick} disabled={waiting || name.trim() == "" || code.trim() == ""}>
					<Text>Join</Text>
				</Button>

			</Box>

			{waiting && (
				<Text className="text-base text-center text-white text-xl">Waiting for host to start the game...</Text>
			)}

		</>
	)
}