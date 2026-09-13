import assert from 'node:assert/strict';
import test from 'node:test';
import sharp from 'sharp';
import { prepareAvatar, MAX_AVATAR_BYTES } from '../lib/account/avatar.mjs';

test('re-encodes real bytes, crops square and strips metadata', async () => {
  const source = await sharp({create:{width:900,height:600,channels:3,background:'#3377cc'}}).withExif({IFD0:{Artist:'Private metadata'}}).jpeg().toBuffer();
  assert((await sharp(source).metadata()).exif);
  const result = await prepareAvatar(source);
  const metadata = await sharp(result).metadata();
  assert.equal(metadata.format,'webp');
  assert.equal(metadata.width,512);
  assert.equal(metadata.height,512);
  assert.equal(metadata.exif,undefined);
});
test('rejects disguised SVG, HTML, corrupt and oversized input', async () => {
  for(const input of [Buffer.from('<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"></svg>'),Buffer.from('<script>alert(1)</script>'),Buffer.from([0xff,0xd8,0,1]),Buffer.alloc(MAX_AVATAR_BYTES+1)]) await assert.rejects(prepareAvatar(input));
});
test('rejects small compressed images with excessive decoded pixels', async () => {
  const image = await sharp({create:{width:5000,height:5000,channels:3,background:'#fff'}}).png().toBuffer();
  assert(image.length<MAX_AVATAR_BYTES);
  await assert.rejects(prepareAvatar(image));
});
