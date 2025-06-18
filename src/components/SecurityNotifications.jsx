import SecurityNotification from './SecurityNotification';

const SecurityNotifications = ({ notifications, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map(notification => (
        <SecurityNotification
          key={notification.id}
          type={notification.type}
          message={notification.message}
          duration={notification.duration}
          onClose={() => onRemove(notification.id)}
        />
      ))}
    </div>
  );
};

export default SecurityNotifications; 