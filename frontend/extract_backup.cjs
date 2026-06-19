const fs = require('fs');
try {
  const lines = fs.readFileSync('C:/Users/cii/.gemini/antigravity/brain/c4ee3303-c868-47f7-a6da-08c086103bec/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');
  const tool = lines.find(l => l.includes('write_to_file') && l.includes('App.jsx') && l.includes('CodeContent'));
  if(tool) { 
    const parsed = JSON.parse(tool);
    // Find the right property
    const toolCall = parsed.tool_calls ? parsed.tool_calls[0] : null;
    let argsStr = '';
    if(toolCall && toolCall.function && toolCall.function.arguments) {
      argsStr = toolCall.function.arguments;
    } else {
      argsStr = parsed.content;
    }
    const args = JSON.parse(argsStr);
    if(args.CodeContent) {
      fs.writeFileSync('c:/Users/cii/Desktop/Haşere İlaçlama/frontend/src/App_backup.jsx', args.CodeContent, 'utf8'); 
      console.log('RESTORED_c4ee'); 
    }
  } else { 
    console.log('NOT FOUND in c4ee'); 
  }
} catch (e) {
  console.log(e);
}
