// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function () {
    // 获取DOM元素
    const studentListTextarea = document.getElementById('student-list');
    const fileInput = document.getElementById('file-input');
    const fileName = document.getElementById('file-name');
    const saveListBtn = document.getElementById('save-list');
    const rollCallBtn = document.getElementById('roll-call-btn');
    const resetHistoryBtn = document.getElementById('reset-history');
    const selectedStudent = document.getElementById('selected-student');
    const historyList = document.getElementById('history-list');

    // 定义变量
    let students = []; // 学生名单
    let calledStudents = []; // 已点名学生
    let isRolling = false; // 是否正在点名
    let rollInterval; // 点名动画间隔

    // 从本地存储加载数据
    function loadData() {
        const savedStudents = getFromLocalStorage('students');
        const savedCalledStudents = getFromLocalStorage('calledStudents');

        if (savedStudents) {
            students = savedStudents;
            studentListTextarea.value = students.join('\n');
        }

        if (savedCalledStudents) {
            calledStudents = savedCalledStudents;
            updateHistoryList();
        }
    }

    // 更新历史记录列表
    function updateHistoryList() {
        historyList.innerHTML = '';

        if (calledStudents.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.textContent = '暂无点名记录';
            historyList.appendChild(emptyItem);
            return;
        }

        // 显示最近的10个点名记录（倒序排列）
        const recentCalled = [...calledStudents].reverse().slice(0, 10);

        recentCalled.forEach((student, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${index + 1}. ${student}`;
            historyList.appendChild(listItem);
        });
    }

    // 保存学生名单
    function saveStudentList() {
        const text = studentListTextarea.value.trim();

        if (!text) {
            alert('请输入学生名单');
            return;
        }

        // 分行解析学生名单，过滤空行
        students = text.split('\n')
            .map(name => name.trim())
            .filter(name => name !== '');

        if (students.length === 0) {
            alert('请输入有效的学生名单');
            return;
        }

        // 保存到本地存储
        saveToLocalStorage('students', students);

        alert(`已保存 ${students.length} 名学生的名单`);
    }

    // 随机点名
    function rollCall() {
        if (isRolling) {
            // 如果正在点名动画中，则停止动画并选择学生
            stopRolling();
            return;
        }

        if (students.length === 0) {
            alert('请先添加学生名单');
            return;
        }

        // 如果所有学生都已被点过名，重置点名记录
        if (calledStudents.length >= students.length) {
            if (confirm('所有学生都已被点过名，是否重置点名记录？')) {
                calledStudents = [];
                saveToLocalStorage('calledStudents', calledStudents);
                updateHistoryList();
            } else {
                return;
            }
        }

        // 开始点名动画
        startRolling();
    }

    // 开始点名动画
    function startRolling() {
        isRolling = true;
        rollCallBtn.textContent = '停止点名';
        rollCallBtn.innerHTML = '<i class="fas fa-stop"></i> 停止点名';

        // 获取未点名的学生
        const availableStudents = students.filter(student => !calledStudents.includes(student));

        // 随机切换显示学生名字
        rollInterval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * availableStudents.length);
            selectedStudent.textContent = availableStudents[randomIndex];
        }, 50);
    }

    // 停止点名动画并选择学生
    function stopRolling() {
        isRolling = false;
        rollCallBtn.innerHTML = '<i class="fas fa-random"></i> 随机点名';
        clearInterval(rollInterval);

        // 获取未点名的学生
        const availableStudents = students.filter(student => !calledStudents.includes(student));

        // 随机选择一名学生
        const selectedIndex = Math.floor(Math.random() * availableStudents.length);
        const selected = availableStudents[selectedIndex];

        // 添加到已点名列表
        calledStudents.push(selected);
        saveToLocalStorage('calledStudents', calledStudents);

        // 更新显示和历史记录
        selectedStudent.textContent = selected;
        updateHistoryList();

        // 显示庆祝效果
        createConfetti();
    }

    // 重置点名记录
    function resetHistory() {
        if (confirm('确定要重置所有点名记录吗？')) {
            calledStudents = [];
            saveToLocalStorage('calledStudents', calledStudents);
            updateHistoryList();
            selectedStudent.textContent = '';
        }
    }

    // 处理文件导入
    function handleFileImport(e) {
        const file = e.target.files[0];

        if (!file) return;

        // 显示文件名
        fileName.textContent = file.name;

        const reader = new FileReader();

        reader.onload = function (e) {
            const content = e.target.result;

            // 根据文件类型处理数据
            if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
                processTextFile(content);
            } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
                processExcelFile(content);
            } else {
                alert('不支持的文件格式，请上传CSV、TXT或Excel文件');
            }
        };

        if (file.name.endsWith('.csv') || file.name.endsWith('.txt')) {
            reader.readAsText(file);
        } else if (file.name.endsWith('.xlsx') || file.name.endsWith('.xls')) {
            reader.readAsArrayBuffer(file);
        }
    }

    // 处理文本文件（CSV、TXT）
    function processTextFile(content) {
        const lines = content.split(/\r\n|\n/).map(line => line.trim()).filter(line => line !== '');
        studentListTextarea.value = lines.join('\n');
    }

    // 处理Excel文件
    function processExcelFile(content) {
        try {
            // 使用xlsx库处理Excel文件
            const data = new Uint8Array(content);
            const workbook = XLSX.read(data, { type: 'array' });

            // 获取第一个工作表
            const firstSheet = workbook.Sheets[workbook.SheetNames[0]];

            // 将工作表转换为数组
            const rows = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

            // 提取第一列作为学生名单
            const names = rows.map(row => row[0]).filter(name => name && typeof name === 'string');

            studentListTextarea.value = names.join('\n');
        } catch (error) {
            console.error('处理Excel文件时出错:', error);
            alert('处理Excel文件时出错，请检查文件格式');
        }
    }

    // 绑定事件
    saveListBtn.addEventListener('click', saveStudentList);
    rollCallBtn.addEventListener('click', rollCall);
    resetHistoryBtn.addEventListener('click', resetHistory);
    fileInput.addEventListener('change', handleFileImport);

    // 初始加载数据
    loadData();
}); 