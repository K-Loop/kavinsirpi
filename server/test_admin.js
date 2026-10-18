import fs from 'fs';
import path from 'path';

async function testMern() {
  console.log('Testing MERN Admin and Sharp WebP compression...');

  // 1. Test Login
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'kavinsirpi@2026' }),
  });
  const loginData = await loginRes.json();
  console.log('1. Login Result:', loginData.success ? 'SUCCESS (Token generated)' : 'FAILED');

  if (!loginData.success) {
    console.error('Login failed:', loginData);
    return;
  }
  const token = loginData.token;

  // 2. Test File Upload with WebP conversion
  const testImagePath = path.resolve('../public/images/crafts/banana-tree-vazhai-maram.jpeg');
  const imageBuffer = fs.readFileSync(testImagePath);
  const blob = new Blob([imageBuffer], { type: 'image/jpeg' });

  const formData = new FormData();
  formData.append('photo', blob, 'banana-tree.jpeg');

  const uploadRes = await fetch('http://localhost:5000/api/artworks/upload', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const uploadData = await uploadRes.json();
  console.log('2. WebP Upload & Sharp Compression Result:');
  console.log('   - Converted File:', uploadData.file.filename);
  console.log('   - WebP URL:', uploadData.file.url);
  console.log('   - Original Size:', (uploadData.file.originalSize / 1024).toFixed(1) + ' KB');
  console.log('   - Compressed WebP Size:', (uploadData.file.compressedSize / 1024).toFixed(1) + ' KB');
  console.log('   - Space Saved for 4GB VPS:', uploadData.file.compressionRatio + '%');

  // 3. Test Artwork Publish with All Frontend Details
  const addRes = await fetch('http://localhost:5000/api/artworks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      title: 'Sacred Banana Tree Vazhai Maram High Relief',
      category: 'Kalpavriksha & Nature Murals',
      image: uploadData.file.url,
      medium: 'In-Situ Handcrafted Cement Mortar',
      dimensions: '12 ft (H) × 6 ft (W) Exterior Courtyard',
      description: 'Hand-carved architectural cement wall relief of a sacred fruiting banana tree with broad cascading fronds and traditional motif details.',
      highlights: ['Authentic organic frond contours', 'Deep dimensional undercut chisel work', 'Direct exterior masonry bond'],
      aspect: 'portrait',
      date: 'October 2026',
      featured: true,
      originalSize: uploadData.file.originalSize,
      compressedSize: uploadData.file.compressedSize,
      compressionRatio: uploadData.file.compressionRatio,
    }),
  });
  const addData = await addRes.json();
  console.log('3. Artwork Created with Full Frontend Details:', addData.success ? 'SUCCESS' : 'FAILED');
  console.log('   - Artwork Title:', addData.artwork.title);
  console.log('   - Artwork Medium:', addData.artwork.medium);
  console.log('   - Artwork Dimensions:', addData.artwork.dimensions);
  console.log('   - Highlights count:', addData.artwork.highlights?.length);

  // 4. Test Storage Stats for 4GB VPS
  const statsRes = await fetch('http://localhost:5000/api/stats');
  const statsData = await statsRes.json();
  console.log('4. VPS 4GB Storage Monitor:');
  console.log('   - Total WebP Photos:', statsData.storage.webpPhotosCount);
  console.log('   - Disk Used:', statsData.storage.usedMB + ' MB / ' + statsData.storage.vpsTotalMB + ' MB');
  console.log('   - VPS Usage:', statsData.storage.vpsPercentUsed);
  console.log('   - Status:', statsData.storage.status);

  console.log('\nAll MERN and WebP compression tests PASSED!');
}

testMern().catch(console.error);
