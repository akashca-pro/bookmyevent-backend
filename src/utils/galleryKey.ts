function generateGalleryKey(): string {
    const timestamp = Date.now(); // ms precision
    const random = Math.random().toString(36).slice(2, 8); // short entropy
    return `gallery_${timestamp}_${random}`;
}