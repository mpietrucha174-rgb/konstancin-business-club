// Fixed tabletop framing; no orbit controls or zoom gestures.
export function fitBoardCamera(camera,width,height){
 const aspect=width/height;
 const span=Math.max(27,35.8/aspect);
 camera.position.set(28,30,28);
 camera.lookAt(0,0,0);
 camera.zoom=1;
 camera.left=-span*aspect/2;camera.right=span*aspect/2;
 camera.top=span/2;camera.bottom=-span/2;
 camera.updateProjectionMatrix();camera.updateMatrixWorld();
}
