@echo off
cd /d c:\Users\aashu\OneDrive\Desktop\demo
node server\reproduce_issue.js > reproduction_log.txt 2>&1
node server\test-links.js > test_log.txt 2>&1
echo Done
