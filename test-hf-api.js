// Test standard HF Inference API
async function testStandardAPI() {
    const response = await fetch(
        "https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct",
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                inputs: "What is the capital of France?",
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7
                }
            }),
        }
    );
    
    console.log('Standard API Response status:', response.status);
    console.log('Standard API Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Standard API Error response:', errorText);
        return { error: errorText };
    }
    
    const result = await response.json();
    return result;
}

// Test Router API
async function testRouterAPI() {
    const response = await fetch(
        "https://router.huggingface.co/v1/chat/completions",
        {
            headers: {
                Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                messages: [
                    {
                        role: "user",
                        content: "What is the capital of France?",
                    },
                ],
                model: "Qwen/Qwen2.5-Coder-32B-Instruct:featherless-ai",
            }),
        }
    );
    
    console.log('Router API Response status:', response.status);
    console.log('Router API Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error('Router API Error response:', errorText);
        return { error: errorText };
    }
    
    const result = await response.json();
    return result;
}

console.log('Testing Standard HF Inference API...');
testStandardAPI().then((response) => {
    console.log('Standard API Final response:', JSON.stringify(response, null, 2));
    
    console.log('\nTesting Router API...');
    return testRouterAPI();
}).then((response) => {
    console.log('Router API Final response:', JSON.stringify(response, null, 2));
}).catch((error) => {
    console.error('Error:', error);
});