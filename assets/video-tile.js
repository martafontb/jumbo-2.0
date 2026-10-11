/**
 * <video-tile>: click (or the play button) toggles playback; a bar tracks
 * progress. Only one tile plays at a time.
 */
class VideoTile extends HTMLElement {
  connectedCallback() {
    this.video = this.querySelector('video');
    this.button = this.querySelector('[data-toggle]');
    this.fill = this.querySelector('[data-progress]');
    if (!this.video) return;

    this.addEventListener('click', this.toggle);
    this.video.addEventListener('timeupdate', this.onTime);
    this.video.addEventListener('play', this.sync);
    this.video.addEventListener('pause', this.sync);
    this.video.addEventListener('ended', this.sync);
  }

  toggle = (event) => {
    if (event.target.closest('a')) return;
    if (this.video.paused) {
      document.querySelectorAll('video-tile').forEach((tile) => tile !== this && tile.video?.pause());
      this.video.play().catch(() => {});
    } else {
      this.video.pause();
    }
  };

  onTime = () => {
    if (!this.fill || !this.video.duration) return;
    this.fill.style.width = `${(this.video.currentTime / this.video.duration) * 100}%`;
  };

  sync = () => {
    if (!this.button) return;
    const paused = this.video.paused;
    this.button.querySelector('[data-icon-play]').hidden = !paused;
    this.button.querySelector('[data-icon-pause]').hidden = paused;
    this.button.setAttribute('aria-label', paused ? this.button.dataset.playLabel : this.button.dataset.pauseLabel);
  };
}

if (!customElements.get('video-tile')) customElements.define('video-tile', VideoTile);
