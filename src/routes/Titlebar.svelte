<script>
import { appWindow } from '@tauri-apps/api/tauri';
const hide = () => appWindow.hide();
const close = () => appWindow.close();
</script>

<div data-tauri-drag-region class="titlebar">
	<div class="titlebar-button" id="titlebar-hide" on:click={hide()}>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);">
			<path fill="currentColor" d="M9 9H3V7h4V3h2v6Zm0 6H3v2h4v4h2v-6Zm12 0h-6v6h2v-4h4v-2Zm-6-6h6V7h-4V3h-2v6Z"/>
		</svg>
	</div>
	<div class="titlebar-button" style="margin-right: 8px" on:click={close()}>
		<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" style="-ms-transform: rotate(360deg); -webkit-transform: rotate(360deg); transform: rotate(360deg);">
			<path fill="currentColor" d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"/>
		</svg>
	</div>
</div>

<style>
.titlebar {
height: 30px;
user-select: none;
display: flex;
justify-content: flex-end;
position: fixed;
top: 0;
left: 0;
right: 0;
}

.titlebar-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  opacity: 0.6;
}
.titlebar-button:hover {
	opacity: 1;
}
</style>
