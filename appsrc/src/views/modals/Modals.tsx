import Toast from "./ToastModal.tsx";
import FullscreenModal from "./fullscreen.tsx";
import Popup from "./popup.tsx";
import Slide from "./slide.tsx";
import Toolshed from "./toolshed.tsx";

export default function Modals() {
	return (
		<>
			<FullscreenModal />
			<Toast />
			<Toolshed />
			<Popup />
			<Slide />
		</>
	);
}
