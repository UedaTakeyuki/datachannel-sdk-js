import PocketBase from 'pocketbase'

// Create a single instance to reuse across the entire app
export const pb = new PocketBase('https://datachannelserver.uedasoft.com');

// Disable auto-cancellation
pb.autoCancellation(false);

//export default pb;
