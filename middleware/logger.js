function requestLogger(req, res, next) {
  const startTime = Date.now();
  
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  
  if (Object.keys(req.body).length > 0) {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  
  if (Object.keys(req.query).length > 0) {
    console.log('Query Params:', JSON.stringify(req.query, null, 2));
  }
  
  if (Object.keys(req.params).length > 0) {
    console.log('Route Params:', JSON.stringify(req.params, null, 2));
  }
  
  const originalSend = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    
    console.log(`Response Status: ${res.statusCode}`);
    console.log(`Response Time: ${duration}ms`);
    
    if (data && typeof data === 'object') {
      console.log('Response Data:', JSON.stringify({
        status: data.status,
        statusCode: data.statusCode,
        message: data.message,
        count: data.count,
        dataLength: Array.isArray(data.data) ? data.data.length : data.data ? 1 : 0
      }, null, 2));
    }
    
    console.log('═══════════════════════════════════════════════════════════\n');
    
    return originalSend.call(this, data);
  };
  
  next();
}

module.exports = requestLogger;

