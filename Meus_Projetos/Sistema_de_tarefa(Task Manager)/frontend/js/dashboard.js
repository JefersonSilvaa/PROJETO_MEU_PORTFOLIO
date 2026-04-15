let tasks = [];
let users = [];
let notifications = [];
let currentFilter = 'all';
let editingTaskId = null;
let activeSector = 'ti';
let sectorsOpen = true;
let showAllNotifications = false;

const STORAGE_USERS = 'desk_users';
const STORAGE_TASKS = 'desk_tasks';
const STORAGE_NOTIFICATIONS = 'desk_notifications';

function createId() {
    return `id_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function getDefaultUsers() {
    return [
        { id: 'u1', name: 'Joao', sector: 'ti', activity: 'Online hoje' },
        { id: 'u2', name: 'Sarah', sector: 'ti', activity: 'Ativo' },
        { id: 'u3', name: 'Felipe', sector: 'ti', activity: 'Ativo' },
        { id: 'u4', name: 'Carla', sector: 'marketing', activity: 'Online hoje' },
        { id: 'u5', name: 'Bruno', sector: 'administrativo', activity: 'Ativo' }
    ];
}

function getDefaultTasks() {
    return [
        {
            _id: createId(),
            title: 'Instalar novos servidores',
            completed: false,
            assignedTo: 'u1',
            startDate: '2026-04-23',
            endDate: '2026-04-25',
            time: '11:30'
        },
        {
            _id: createId(),
            title: 'Realizar backup mensal',
            completed: false,
            assignedTo: 'u2',
            startDate: '2026-04-22',
            endDate: '2026-04-24',
            time: '15:30'
        },
        {
            _id: createId(),
            title: 'Configurar rede VPN',
            completed: true,
            assignedTo: 'u3',
            startDate: '2026-04-22',
            endDate: '2026-04-25',
            time: '17:00'
        }
    ];
}

function getDefaultNotifications() {
    return [
        { id: createId(), text: 'Pedido de pagamento recebido', time: 'ha 15 minutos', read: false },
        { id: createId(), text: 'Pagamento realizado', time: 'ha 30 minutos', read: false },
        { id: createId(), text: 'Tarefa adiantada por Felipe', time: 'ha 1 hora', read: false },
        { id: createId(), text: 'Nova tarefa criada', time: 'ha 2 horas', read: false }
    ];
}

function safeParse(raw, fallback) {
    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : fallback;
    } catch (error) {
        return fallback;
    }
}

function loadState() {
    users = safeParse(localStorage.getItem(STORAGE_USERS), getDefaultUsers());
    tasks = safeParse(localStorage.getItem(STORAGE_TASKS), getDefaultTasks());
    notifications = safeParse(localStorage.getItem(STORAGE_NOTIFICATIONS), getDefaultNotifications());
    saveState();
}

function saveState() {
    localStorage.setItem(STORAGE_USERS, JSON.stringify(users));
    localStorage.setItem(STORAGE_TASKS, JSON.stringify(tasks));
    localStorage.setItem(STORAGE_NOTIFICATIONS, JSON.stringify(notifications));
}

function getUserById(userId) {
    return users.find(user => user.id === userId) || null;
}

function getSectorUsers() {
    return users.filter(user => user.sector === activeSector);
}

function getSectorLabel(sector) {
    if (sector === 'ti') return 'TI';
    if (sector === 'marketing') return 'Marketing';
    return 'Administrativo';
}

function formatDate(dateText) {
    if (!dateText) return 'Sem data';
    const date = new Date(`${dateText}T00:00:00`);
    if (Number.isNaN(date.getTime())) return 'Sem data';
    return date.toLocaleDateString('pt-BR');
}

function addNotification(text) {
    notifications.unshift({
        id: createId(),
        text,
        time: 'agora',
        read: false
    });
    notifications = notifications.slice(0, 25);
    saveState();
    renderNotifications();
}

function renderLeftPeople() {
    const leftPeopleList = document.getElementById('leftPeopleList');
    const sectorUsers = getSectorUsers();

    if (sectorUsers.length === 0) {
        leftPeopleList.innerHTML = '<div class="empty-state">Sem pessoas neste setor.</div>';
        return;
    }

    leftPeopleList.innerHTML = sectorUsers.map(user => {
        const pendingCount = tasks.filter(task => task.assignedTo === user.id && !task.completed).length;
        return `
            <div class="person-card">
                <div class="person-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
                <div class="person-meta">
                    <strong>${escapeHtml(user.name)}</strong>
                    <small>${pendingCount} tarefa(s) pendente(s)</small>
                </div>
                <span class="person-check"><i class="bi bi-check2-circle" aria-hidden="true"></i></span>
            </div>
        `;
    }).join('');
}

function fillUserSelects() {
    const taskUser = document.getElementById('taskUser');
    const editTaskUser = document.getElementById('editTaskUser');
    const sectorUsers = getSectorUsers();

    const options = sectorUsers.map(user => (
        `<option value="${user.id}">${escapeHtml(user.name)}</option>`
    )).join('');

    taskUser.innerHTML = options;
    editTaskUser.innerHTML = options;
}

function renderProfessionalPanel() {
    const proPeopleList = document.getElementById('proPeopleList');
    const sectorUsers = getSectorUsers();

    if (sectorUsers.length === 0) {
        proPeopleList.innerHTML = '<div class="empty-state">Sem colaboradores neste setor.</div>';
        return;
    }

    proPeopleList.innerHTML = sectorUsers.map(user => `
        <div class="pro-card">
            <div class="person-avatar">${escapeHtml(user.name.charAt(0).toUpperCase())}</div>
            <div>
                <strong>${escapeHtml(user.name)}</strong>
                <small>Departamento de ${getSectorLabel(user.sector)}</small>
            </div>
            <span class="status-pill">${escapeHtml(user.activity)}</span>
        </div>
    `).join('');
}

function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    const items = showAllNotifications ? notifications : notifications.slice(0, 4);

    if (items.length === 0) {
        notificationList.innerHTML = '<div class="empty-state">Sem notificacoes.</div>';
        return;
    }

    notificationList.innerHTML = items.map(item => `
        <div class="notify-item" style="opacity:${item.read ? '0.55' : '1'};">
            <strong>${escapeHtml(item.text)}</strong>
            <small>${escapeHtml(item.time)}</small>
        </div>
    `).join('');
}

function getVisibleTasks() {
    const sectorUserIds = new Set(getSectorUsers().map(user => user.id));
    const sectorTasks = tasks.filter(task => sectorUserIds.has(task.assignedTo));

    if (currentFilter === 'pending') return sectorTasks.filter(task => !task.completed);
    if (currentFilter === 'completed') return sectorTasks.filter(task => task.completed);
    return sectorTasks;
}

function renderTasks() {
    const tasksList = document.getElementById('tasksList');
    const visibleTasks = getVisibleTasks();

    if (visibleTasks.length === 0) {
        tasksList.innerHTML = '<div class="empty-state">Sem tarefas para este filtro/setor.</div>';
        return;
    }

    tasksList.innerHTML = visibleTasks.map(task => {
        const statusClass = task.completed ? 'completed' : 'pending';
        const statusText = task.completed ? 'Concluida' : 'Pendente';
        const user = getUserById(task.assignedTo);
        const assignedName = user ? user.name : 'Sem responsavel';

        return `
            <div class="task-item ${statusClass}">
                <input
                    type="checkbox"
                    class="task-checkbox"
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask('${task._id}')"
                >
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    <div class="task-meta">
                        <span>Responsavel: ${escapeHtml(assignedName)}</span>
                        <span>Inicio: ${formatDate(task.startDate)}</span>
                        <span>Entrega: ${formatDate(task.endDate)}</span>
                        <span>Hora: ${task.time || '--:--'}</span>
                        <span class="status-badge ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="task-btn task-btn-edit" type="button" onclick="openEditModal('${task._id}')">Editar</button>
                    <button class="task-btn task-btn-delete" type="button" onclick="deleteTask('${task._id}')">Excluir</button>
                </div>
            </div>
        `;
    }).join('');
}

function updateStats() {
    const visibleTasks = getVisibleTasks();
    const pending = visibleTasks.filter(task => !task.completed).length;
    const completed = visibleTasks.filter(task => task.completed).length;
    document.getElementById('statsText').textContent = `${pending} pendentes | ${completed} concluidas`;
}

function addTask() {
    const titleInput = document.getElementById('taskInput');
    const userInput = document.getElementById('taskUser');
    const startDateInput = document.getElementById('taskStartDate');
    const endDateInput = document.getElementById('taskEndDate');
    const timeInput = document.getElementById('taskTime');

    const title = titleInput.value.trim();
    if (!title || !userInput.value) return;

    tasks.unshift({
        _id: createId(),
        title,
        completed: false,
        assignedTo: userInput.value,
        startDate: startDateInput.value || null,
        endDate: endDateInput.value || null,
        time: timeInput.value || null
    });

    titleInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    timeInput.value = '';

    saveState();
    addNotification('Nova atividade adicionada');
    renderAll();
}

function addPerson() {
    const nameInput = document.getElementById('personName');
    const sectorInput = document.getElementById('personSector');
    const activityInput = document.getElementById('personActivity');

    if (!nameInput || !sectorInput || !activityInput) return;

    const name = nameInput.value.trim();
    const sector = sectorInput.value;
    const activity = activityInput.value;

    if (!name) return;

    users.push({
        id: createId(),
        name,
        sector,
        activity
    });

    nameInput.value = '';
    saveState();
    addNotification(`Pessoa adicionada: ${name}`);
    setActiveSector(sector);
}

function toggleTask(taskId) {
    const task = tasks.find(item => item._id === taskId);
    if (!task) return;

    task.completed = !task.completed;
    saveState();
    addNotification(task.completed ? 'Atividade concluida' : 'Atividade reaberta');
    renderAll();
}

function openEditModal(taskId) {
    const task = tasks.find(item => item._id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    document.getElementById('editTaskTitle').value = task.title;
    document.getElementById('editTaskStartDate').value = task.startDate || '';
    document.getElementById('editTaskEndDate').value = task.endDate || '';
    document.getElementById('editTaskTime').value = task.time || '';
    fillUserSelects();
    document.getElementById('editTaskUser').value = task.assignedTo;
    document.getElementById('editModal').style.display = 'grid';
}

function closeEditModal() {
    editingTaskId = null;
    document.getElementById('editModal').style.display = 'none';
}

function saveEditTask(event) {
    event.preventDefault();
    if (!editingTaskId) return;

    const task = tasks.find(item => item._id === editingTaskId);
    if (!task) return;

    const title = document.getElementById('editTaskTitle').value.trim();
    const startDate = document.getElementById('editTaskStartDate').value;
    const endDate = document.getElementById('editTaskEndDate').value;
    const time = document.getElementById('editTaskTime').value;
    const assignedTo = document.getElementById('editTaskUser').value;

    if (!title || !assignedTo) return;

    task.title = title;
    task.startDate = startDate || null;
    task.endDate = endDate || null;
    task.time = time || null;
    task.assignedTo = assignedTo;

    saveState();
    addNotification('Atividade editada');
    closeEditModal();
    renderAll();
}

function deleteTask(taskId) {
    if (!confirm('Deseja remover esta atividade?')) return;

    tasks = tasks.filter(item => item._id !== taskId);
    saveState();
    addNotification('Atividade removida');
    renderAll();
}

function setActiveSector(sector) {
    activeSector = sector;
    document.querySelectorAll('.sector-item').forEach(button => {
        button.classList.toggle('active', button.dataset.sector === sector);
    });
    renderAll();
}

function toggleSectors() {
    sectorsOpen = !sectorsOpen;
    const sectorList = document.getElementById('sectorList');
    const sectorArrow = document.getElementById('sectorArrow');
    sectorList.style.display = sectorsOpen ? 'grid' : 'none';
    sectorArrow.textContent = sectorsOpen ? 'v' : '>';
}

function sendQuickMessage() {
    const input = document.getElementById('quickMessageInput');
    const value = input.value.trim();
    if (!value) return;

    addNotification(`Mensagem enviada: ${value}`);
    input.value = '';
}

function markAllRead() {
    notifications = notifications.map(item => ({ ...item, read: true }));
    saveState();
    renderNotifications();
}

function toggleSeeAllNotifications() {
    showAllNotifications = !showAllNotifications;
    document.getElementById('seeAllBtn').textContent = showAllNotifications ? 'Ver menos' : 'Ver Tudo';
    renderNotifications();
}

function resetAll() {
    users = getDefaultUsers();
    tasks = getDefaultTasks();
    notifications = getDefaultNotifications();
    currentFilter = 'all';
    activeSector = 'ti';
    showAllNotifications = false;

    saveState();

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.filter === 'all');
    });
    document.getElementById('seeAllBtn').textContent = 'Ver Tudo';

    setActiveSector('ti');
    addNotification('Dados reiniciados');
    renderAll();
}

function renderAll() {
    fillUserSelects();
    renderLeftPeople();
    renderProfessionalPanel();
    renderTasks();
    renderNotifications();
    updateStats();
}

function setupEvents() {
    document.getElementById('addTaskBtn').addEventListener('click', addTask);

    const addPersonBtn = document.getElementById('addPersonBtn');
    if (addPersonBtn) {
        addPersonBtn.addEventListener('click', addPerson);
    }

    document.getElementById('taskInput').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            addTask();
        }
    });

    const personName = document.getElementById('personName');
    if (personName) {
        personName.addEventListener('keydown', event => {
            if (event.key === 'Enter') {
                event.preventDefault();
                addPerson();
            }
        });
    }

    document.querySelectorAll('.tab-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(item => item.classList.remove('active'));
            button.classList.add('active');
            currentFilter = button.dataset.filter;
            renderTasks();
            updateStats();
        });
    });

    document.querySelectorAll('.sector-item').forEach(button => {
        button.addEventListener('click', () => setActiveSector(button.dataset.sector));
    });

    document.getElementById('sectorToggle').addEventListener('click', toggleSectors);
    document.getElementById('logoutBtn').addEventListener('click', resetAll);

    document.getElementById('quickMessageBtn').addEventListener('click', sendQuickMessage);
    document.getElementById('quickMessageInput').addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendQuickMessage();
        }
    });

    document.getElementById('markAllReadBtn').addEventListener('click', markAllRead);
    document.getElementById('markReadFooterBtn').addEventListener('click', markAllRead);
    document.getElementById('seeAllBtn').addEventListener('click', toggleSeeAllNotifications);

    document.getElementById('closeEdit').addEventListener('click', closeEditModal);
    document.getElementById('cancelEdit').addEventListener('click', closeEditModal);
    document.getElementById('editForm').addEventListener('submit', saveEditTask);
    document.getElementById('editModal').addEventListener('click', event => {
        if (event.target.id === 'editModal') {
            closeEditModal();
        }
    });

    const mobileSidebarBtn = document.getElementById('mobileSidebarBtn');
    if (mobileSidebarBtn) {
        mobileSidebarBtn.addEventListener('click', () => {
            document.getElementById('layoutShell').classList.toggle('sidebar-open');
        });
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.toggleTask = toggleTask;
window.openEditModal = openEditModal;
window.deleteTask = deleteTask;

window.addEventListener('DOMContentLoaded', () => {
    localStorage.setItem('fixedUserName', 'Admin');
    loadState();
    setActiveSector('ti');
    setupEvents();
    renderAll();
});
