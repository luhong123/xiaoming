// ============================================
// Matrix 雨滴背景 (requestAnimationFrame 优化)
// ============================================
(function matrixRain() {
    const canvas = document.getElementById('matrix');
    const ctx = canvas.getContext('2d');
    const FONT_SIZE = 14;
    const CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';
    const FADE_ALPHA = 0.05;

    let width, height, cols, drops;
    let lastDraw = 0;
    const INTERVAL = 50; // ms between frames

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        cols = Math.floor(width / FONT_SIZE);
        drops = new Array(cols).fill(0).map(() => Math.random() * -height / FONT_SIZE);
    }

    resize();
    window.addEventListener('resize', resize);

    function draw(timestamp) {
        if (timestamp - lastDraw < INTERVAL) {
            requestAnimationFrame(draw);
            return;
        }
        lastDraw = timestamp;

        ctx.fillStyle = `rgba(13, 17, 23, ${FADE_ALPHA})`;
        ctx.fillRect(0, 0, width, height);
        ctx.font = FONT_SIZE + 'px monospace';
        ctx.fillStyle = '#00ff41';

        for (let i = 0; i < drops.length; i++) {
            const char = CHARS[Math.floor(Math.random() * CHARS.length)];
            const x = i * FONT_SIZE;
            const y = drops[i] * FONT_SIZE;

            ctx.fillText(char, x, y);

            if (y > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }

        requestAnimationFrame(draw);
    }

    requestAnimationFrame(draw);
})();

// ============================================
// 打字机动画（最后一行保留不删）
// ============================================
(function typeAnimation() {
    const el = document.getElementById('typing-text');
    const lines = [
        'Full Stack Developer',
        'Building things for the web',
        'Welcome to my terminal.'
    ];
    const LAST_LINE = lines.length - 1;
    let lineIdx = 0;
    let charIdx = 0;
    let isDeleting = false;

    function type() {
        if (lineIdx > LAST_LINE) return;

        if (!isDeleting) {
            el.textContent = lines[lineIdx].slice(0, ++charIdx);

            if (charIdx === lines[lineIdx].length) {
                // 最后一行打完就停
                if (lineIdx === LAST_LINE) return;
                setTimeout(type, 2000);
                isDeleting = true;
                return;
            }
            setTimeout(type, 60 + Math.random() * 40);
        } else {
            el.textContent = lines[lineIdx].slice(0, --charIdx);

            if (charIdx === 0) {
                isDeleting = false;
                lineIdx++;
                setTimeout(type, 300);
                return;
            }
            setTimeout(type, 25 + Math.random() * 20);
        }
    }

    setTimeout(type, 800);
})();

// ============================================
// 终端命令系统
// ============================================
(function terminal() {
    const input = document.getElementById('cmd-input');
    const output = document.getElementById('interactive-output');
    const terminalEl = document.getElementById('terminal');

    const history = [];
    let historyIdx = -1;
    let tempInput = '';

    // 命令注册表
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
            return null;
        },

        banner() {
            const el = document.querySelector('.banner');
            return el ? `<pre style="color:#00ff41;font-size:11px;line-height:1.1;text-shadow:0 0 10px rgba(0,255,65,0.3)">${escHtml(el.textContent)}</pre>` : 'banner not found';
        },

        date() {
            return new Date().toString();
        },

        echo(args) {
            return args || '...';
        }
    };

    // 提取所有命令名用于 Tab 补全
    const cmdNames = Object.keys(commands);

    function escHtml(str) {
        return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function addOutput(html, isError) {
        if (html === null) return;
        const div = document.createElement('div');
        div.className = 'cmd-output' + (isError ? ' error' : '');
        div.innerHTML = html;
        output.appendChild(div);
        // 确保新输出不被固定栏遮挡
        div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function addCmdLine(cmd) {
        const div = document.createElement('div');
        div.className = 'cmd-line';
        div.innerHTML = `<span class="prompt">$</span> <span class="typed-cmd">${escHtml(cmd)}</span>`;
        output.appendChild(div);
    }

    function execute(cmdStr) {
        cmdStr = cmdStr.trim();
        if (!cmdStr) return;

        history.push(cmdStr);
        historyIdx = history.length;
        input.value = '';

        addCmdLine(cmdStr);

        const parts = cmdStr.split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1).join(' ');

        if (commands[cmd]) {
            addOutput(commands[cmd](args));
        } else {
            addOutput(`command not found: ${escHtml(cmd)}<br>输入 <span style="color:#58a6ff">help</span> 查看可用命令`, true);
        }
    }

    // ========== 键盘事件 ==========
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            execute(input.value);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            if (historyIdx === history.length) tempInput = input.value;
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
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const val = input.value.toLowerCase();
            const match = cmdNames.find(c => c.startsWith(val));
            if (match) input.value = match + ' ';
        } else if (e.key === 'l' && e.ctrlKey) {
            e.preventDefault();
            output.innerHTML = '';
        }
    });

    // ========== 焦点管理 ==========
    // 点终端任意位置聚焦（但允许选中文字和点链接）
    terminalEl.addEventListener('click', function(e) {
        const tag = e.target.tagName;
        if (tag !== 'A' && tag !== 'INPUT') {
            input.focus();
        }
    });

    // 只在点击终端外部时尝试回焦（终端内自由操作）
    document.addEventListener('click', function(e) {
        if (!terminalEl.contains(e.target)) {
            // 用户在终端外点击，不回焦
            return;
        }
    });

    input.focus();

    // ========== 启动欢迎语 ==========
    const motd = `╔══════════════════════════════════════════╗
║  Welcome to Xiao Ming's Terminal       ║
║  Type <span style="color:#58a6ff">help</span> to see available commands  ║
╚══════════════════════════════════════════╝`;

    setTimeout(() => {
        addCmdLine('motd');
        addOutput(motd);
    }, 3500); // 等打字机动画差不多结束
})();
