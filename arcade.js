// Keep the soundtrack with the game the visitor is watching.
const arcadePageVideos = document.querySelectorAll('main video');
for (const video of arcadePageVideos) {
  video.addEventListener('play', () => {
    for (const other of arcadePageVideos) {
      if (other !== video && !other.paused) other.pause();
    }
  });
}
const arcadeDetails = document.querySelector('.board-arcade');
arcadeDetails?.addEventListener('toggle', () => {
  if (!arcadeDetails.open) arcadeDetails.querySelectorAll('video').forEach(video => video.pause());
});
