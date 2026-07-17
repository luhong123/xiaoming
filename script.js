// ============================================
// Matrix 雨滴背景
// ============================================
(function matrixRain() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');

    let width, height;
    let drops = [];
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;

        const fontSize = 14;
        const cols = Math.floor(width / fontSize);
        drops = [];
        for (let i = 0; i < cols; i++) {
            drops[i] = Math.random() * -height / fontSize;
        }
    }

    resize();
    window.addEventListener('resize', resize);

    function draw() {
        ctx.fillStyle = 'rgba(13, 17, 23, 0.05)';
        ctx.fillRect(0, 0, width, height);

        const fontSize = 14;
        ctx.font = fontSize + 'px monospace';
        ctx.fillStyle = '#00ff41';

        for (let i = 0; i < drops.length; i++) {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const x = i * fontSize;
            const y = drops[i] * fontSize;

            ctx.fillText(char, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    setInterval(draw, 50);
})();

// ============================================
// 打字机动画
// ============================================
(function typeAnimation() {
    const el = document.getElementById('typing-text');
    const lines = [
        'Full Stack Developer',
        'Building things for the web',
        'Welcome to my terminal.'
    ];
    let lineIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let currentLine = '';

    function type() {
        if (lineIdx >= lines.length) return;

        if (!isDeleting) {
            currentLine = lines[lineIdx].slice(0, ++charIdx);
            el.textContent = currentLine;

            if (charIdx === lines[lineIdx].length) {
                // 打完一行，停顿后开始删除
                setTimeout(type, 2000);
                isDeleting = true;
                return;
            }
            setTimeout(type, 60 + Math.random() * 40);
        } else {
            currentLine = lines[lineIdx].slice(0, --charIdx);
            el.textContent = currentLine;

            if (charIdx === 0) {
                isDeleting = false;
                lineIdx++;
                // 切换到下一行
                setTimeout(type, 300);
                return;
            }
            setTimeout(type, 25 + Math.random() * 20);
        }
    }

    // 页面加载后稍等再开始
    setTimeout(type, 800);
})();

// ============================================
// 终端命令系统
// ============================================
(function terminal() {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('interactive-output');
    const terminal = document.getElementById('terminal');
    const inputLine = document.getElementById('input-line');

    const history = [];
    let historyIdx = -1;
    let tempInput = '';

    const commands = {
        help() {
            return `
<span class="help-table">
<span class="h-cmd">whoami</span>   <span class="h-desc">关于我</span>
<span class="h-cmd">skills</span>   <span class="h-desc">技能栈</span>
<span class="h-cmd">projects</span> <span class="h-desc">项目列表</span>
<span class="h-cmd">contact</span>  <span class="h-desc">联系方式</span>
<span class="h-cmd">clear</span>    <span class="h-desc">清屏</span>
<span class="h-cmd">banner</span>   <span class="h-desc">重新显示 logo</span>
<span class="h-cmd">date</span>     <span class="h-desc">当前时间</span>
<span class="h-cmd">echo</span>     <span class="h-desc">回声测试</span>
<span class="h-cmd">help</span>     <span class="h-desc">显示此帮助</span>
</span>`;
        },

        whoami() {
            return '你好，我是 <span class="highlight">小明</span> (Xiao Ming)<br>全栈开发者 | 开源爱好者 | 终身学习者';
        },

        skills() {
            return 'JavaScript / React / Node.js / Python / Git / Docker<br>详见上方 <span class="dim">$ cat skills.txt</span> 区块';
        },

        projects() {
            return `<a href="https://luhong123.github.io/baby-sleep-tracker/" target="_blank">📁 baby-sleep-tracker</a> — 宝宝睡眠记录 PWA<br><span class="dim">更多项目持续更新中...</span>`;
        },

        contact() {
            return `email:  luhong123@gmail.com<br>github: <a href="https://github.com/luhong123" target="_blank">github.com/luhong123</a>`;
        },

        clear() {
            output.innerHTML = '';
            return null; // 不显示任何输出
        },

        banner() {
            const banner = document.querySelector('.banner').textContent;
            return `<pre style="color:#00ff41;font-size:11px;line-height:1.1;text-shadow:0 0 10px rgba(0,255,65,0.3)">${banner}</pre>`;
        },

        date() {
            return new Date().toString();
        },

        echo(args) {
            return args || '...';
        }
    };

    function addOutput(html, isError) {
        if (html === null) return; // clear 命令
        const div = document.createElement('div');
        div.className = 'cmd-output' + (isError ? ' error' : '');
        div.innerHTML = html;
        output.appendChild(div);
        // 滚动到底部
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }

    function addCmdLine(cmd) {
        const div = document.createElement('div');
        div.className = 'cmd-line';
        div.innerHTML = `<span class="prompt">$</span> <span class="typed-cmd">${escapeHtml(cmd)}</span>`;
        output.appendChild(div);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function execute(cmdStr) {
        cmdStr = cmdStr.trim();
        if (!cmdStr) return;

        // 加入历史
        history.push(cmdStr);
        historyIdx = history.length;
        input.value = '';

        // 显示命令行
        addCmdLine(cmdStr);

        // 解析命令和参数
        const parts = cmdStr.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (commands[cmd]) {
            addOutput(commands[cmd](args));
        } else {
            addOutput(`command not found: ${escapeHtml(cmd)}<br>输入 <span class="cmd-color" style="color:#58a6ff">help</span> 查看可用命令`, true);
        }
    }

    // 输入事件
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            execute(input.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            if (historyIdx === history.length) {
                tempInput = input.value;
            }
            if (historyIdx > 0) {
                historyIdx--;
                input.value = history[historyIdx];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx < history.length - 1) {
                historyIdx++;
                input.value = history[historyIdx];
            } else if (historyIdx === history.length - 1) {
                historyIdx++;
                input.value = tempInput;
            }
        }
    });

    // 点击终端任意位置聚焦输入框
    terminal.addEventListener('click', function(e) {
        if (e.target.tagName !== 'A') {
            input.focus();
        }
    });

    // 初始聚焦
    input.focus();

    // 失焦后自动重新聚焦（但允许点击链接）
    input.addEventListener('blur', function() {
        setTimeout(() => {
            if (document.activeElement?.tagName !== 'A') {
                input.focus();
            }
        }, 200);
    });

    // 暴露 execute 到全局
    window.terminalExecute = execute;
})();
