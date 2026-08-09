"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SOCKET_EVENTS = exports.CATEGORY_CONFIG = exports.DoctorStatus = exports.AppointmentStatus = exports.QueueCategory = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["PATIENT"] = "PATIENT";
    UserRole["RECEPTIONIST"] = "RECEPTIONIST";
    UserRole["DOCTOR"] = "DOCTOR";
    UserRole["ADMIN"] = "ADMIN";
})(UserRole || (exports.UserRole = UserRole = {}));
var QueueCategory;
(function (QueueCategory) {
    QueueCategory["EMERGENCY"] = "EMERGENCY";
    QueueCategory["URGENT"] = "URGENT";
    QueueCategory["PRIORITY"] = "PRIORITY";
    QueueCategory["GENERAL"] = "GENERAL";
})(QueueCategory || (exports.QueueCategory = QueueCategory = {}));
var AppointmentStatus;
(function (AppointmentStatus) {
    AppointmentStatus["WAITING"] = "WAITING";
    AppointmentStatus["CALLED"] = "CALLED";
    AppointmentStatus["IN_CONSULTATION"] = "IN_CONSULTATION";
    AppointmentStatus["COMPLETED"] = "COMPLETED";
    AppointmentStatus["CANCELLED"] = "CANCELLED";
})(AppointmentStatus || (exports.AppointmentStatus = AppointmentStatus = {}));
var DoctorStatus;
(function (DoctorStatus) {
    DoctorStatus["AVAILABLE"] = "AVAILABLE";
    DoctorStatus["BUSY"] = "BUSY";
    DoctorStatus["OFF_DUTY"] = "OFF_DUTY";
})(DoctorStatus || (exports.DoctorStatus = DoctorStatus = {}));
// Category Configuration rules
exports.CATEGORY_CONFIG = {
    [QueueCategory.EMERGENCY]: {
        prefix: 'E',
        label: 'Emergency',
        colorHex: '#ef4444',
        badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border-red-300',
        targetMinutes: 0,
        triageScore: 4,
        roomRange: '101 - 105',
        doctorType: 'Emergency Physician'
    },
    [QueueCategory.URGENT]: {
        prefix: 'U',
        label: 'Urgent',
        colorHex: '#f97316',
        badgeClass: 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300 border-orange-300',
        targetMinutes: 15,
        triageScore: 3,
        roomRange: '201 - 205',
        doctorType: 'General Physician'
    },
    [QueueCategory.PRIORITY]: {
        prefix: 'P',
        label: 'Priority',
        colorHex: '#eab308',
        badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300',
        targetMinutes: 30,
        triageScore: 2,
        roomRange: '301 - 305',
        doctorType: 'Specialist'
    },
    [QueueCategory.GENERAL]: {
        prefix: 'G',
        label: 'General OPD',
        colorHex: '#3b82f6',
        badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-300',
        targetMinutes: 60,
        triageScore: 1,
        roomRange: '401 - 420',
        doctorType: 'General OPD'
    }
};
exports.SOCKET_EVENTS = {
    CONNECT: 'connect',
    DISCONNECT: 'disconnect',
    QUEUE_UPDATED: 'queue_updated',
    TICKET_CALLED: 'ticket_called',
    ROOM_STATUS_CHANGED: 'room_status_changed',
    EMERGENCY_ALERT: 'emergency_alert',
    PATIENT_NOTIFICATION: 'patient_notification'
};
