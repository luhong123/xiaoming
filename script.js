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
    const INTERVAL = 50;

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

        ctx.fillStyle = `rgba(10, 10, 10, ${FADE_ALPHA})`;
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
        'AI + DevOps + Full Stack Developer',
        'Building tools with code & intelligence',
        'Welcome to my terminal.',
        'Type help to get started.'
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
                if (lineIdx >= LAST_LINE - 1) return; // 最后两行保留
                setTimeout(type, 2000);
                isDeleting = true;
                return;
            }
            setTimeout(type, 55 + Math.random() * 40);
        } else {
            el.textContent = lines[lineIdx].slice(0, --charIdx);

            if (charIdx === 0) {
                isDeleting = false;
                lineIdx++;
                setTimeout(type, 300);
                return;
            }
            setTimeout(type, 22 + Math.random() * 20);
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

    const commands = {
        help() {
            return `
<span class="help-table">
<span class="h-cmd">whoami</span>          <span class="h-desc">关于我</span>
<span class="h-cmd">skills</span>          <span class="h-desc">技能栈</span>
<span class="h-cmd">ai</span>              <span class="h-desc">AI 经验</span>
<span class="h-cmd">infra / k8s</span>     <span class="h-desc">运维 & 基础设施</span>
<span class="h-cmd">projects</span>        <span class="h-desc">项目列表</span>
<span class="h-cmd">contact</span>         <span class="h-desc">联系方式</span>
<span class="h-cmd">clear</span>           <span class="h-desc">清屏</span>
<span class="h-cmd">banner</span>          <span class="h-desc">重新显示 logo</span>
<span class="h-cmd">date</span>            <span class="h-desc">当前时间</span>
<span class="h-cmd">echo</span>            <span class="h-desc">回声测试</span>
<span class="h-cmd">help</span>            <span class="h-desc">显示此帮助</span>
</span>`;
        },

        whoami() {
            return '你好，我是 <span class="highlight">小明</span> (Xiao Ming)<br>AI 应用开发者 | 云原生运维 | 全栈工程师 | 开源爱好者';
        },

        ai() {
            return `
<span class="highlight">> LLM 应用开发</span>
  熟悉 OpenAI / Claude API，开发过智能对话、代码助手等应用
  掌握 Prompt Engineering、Function Calling、Agent 编排

<span class="highlight">> RAG 检索增强生成</span>
  基于向量数据库搭建知识库问答系统
  文档切片、Embedding、语义检索、重排序全链路

<span class="highlight">> AI 工具链</span>
  LangChain / LlamaIndex / Ollama / Streamlit
  模型微调（LoRA）、量化部署`;
        },

        infra() { return commands.k8s(); },

        k8s() {
            return `
<span class="highlight">> Kubernetes</span>
  生产级 K8s 集群部署与运维，Helm / ArgoCD / GitOps
  Prometheus + Grafana 监控，日志采集与分析

<span class="highlight">> Ceph 分布式存储</span>
  集群搭建、调优与日常运维
  RBD 块存储 / CephFS 文件系统 / RGW 对象存储

<span class="highlight">> 其他</span>
  Ansible / Terraform / Docker / Nginx / Jenkins`;
        },

        skills() {
            return 'LLM 应用 / Prompt Engineering / RAG / Python<br>Kubernetes / Ceph / Docker / Linux<br>JavaScript / React / Node.js / Git<br>详见上方 <span class="dim">$ cat skills.txt</span> 区块';
        },

        projects() {
            return `<a href="https://luhong123.github.io/baby-sleep-tracker/" target="_blank">📁 baby-sleep-tracker</a> — 宝宝睡眠记录 PWA<br><span class="dim">更多项目持续更新中...</span>`;
        },

        contact() {
            return `✉️ Email:  <a href="mailto:ye33445200@qq.com">ye33445200@qq.com</a><br>🐙 GitHub: <a href="https://github.com/luhong123" target="_blank">github.com/luhong123</a>`;
        },

        clear() {
            output.innerHTML = '';
            return null;
        },

        banner() {
            const el = document.querySelector('.banner');
            return el ? `<pre style="color:#00ff41;font-size:10px;line-height:1.1;text-shadow:0 0 20px rgba(0,255,65,0.3)">${escHtml(el.textContent)}</pre>` : 'banner not found';
        },

        date() {
            return new Date().toString();
        },

        echo(args) {
            return args || '...';
        }
    };

    // 别名
    commands.ceph = commands.k8s;
    commands.docker = commands.k8s;

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
        div.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }

    function addCmdLine(cmd) {
        const div = document.createElement('div');
        div.className = 'cmd-line';
        div.innerHTML = `<span class="prompt">root@xiaoming:~$</span> <span class="typed-cmd">${escHtml(cmd)}</span>`;
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
    terminalEl.addEventListener('click', function(e) {
        const tag = e.target.tagName;
        if (tag !== 'A' && tag !== 'INPUT') {
            input.focus();
        }
    });

    input.focus();

    // ========== 启动欢迎语 ==========
    const motd = `╔══════════════════════════════════════════╗
║  🔐 Welcome to Xiao Ming's Terminal     ║
║  AI + DevOps + Full Stack Developer     ║
║  Type <span style="color:#58a6ff">help</span> to see available commands   ║
╚══════════════════════════════════════════╝`;

    setTimeout(() => {
        addCmdLine('motd');
        addOutput(motd);
    }, 5000); // 等打字机结束
})();
