document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // Edit Profile Modal
    const editProfileBtn = document.getElementById('editProfileBtn');
    const editProfileModal = document.getElementById('editProfileModal');
    const closeEditModal = document.getElementById('closeEditModal');
    const cancelEdit = document.getElementById('cancelEdit');
    const editProfileForm = document.getElementById('editProfileForm');

    editProfileBtn.addEventListener('click', function() {
        editProfileModal.style.display = 'flex';
    });

    closeEditModal.addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    cancelEdit.addEventListener('click', function() {
        editProfileModal.style.display = 'none';
    });

    editProfileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('editName').value,
            title: document.getElementById('editTitle').value,
            bio: document.getElementById('editBio').value,
            email: document.getElementById('editEmail').value,
            location: document.getElementById('editLocation').value,
            website: document.getElementById('editWebsite').value
        };

        // Update profile display
        updateProfileDisplay(formData);
        
        // Show success notification
        showNotification('Profile updated successfully!', 'success');
        
        // Close modal
        editProfileModal.style.display = 'none';
    });

    // Settings Modal
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettingsModal = document.getElementById('closeSettingsModal');

    settingsBtn.addEventListener('click', function() {
        settingsModal.style.display = 'flex';
    });

    closeSettingsModal.addEventListener('click', function() {
        settingsModal.style.display = 'none';
    });

    // Change Password
    const changePasswordBtn = document.getElementById('changePasswordBtn');
    changePasswordBtn.addEventListener('click', function() {
        showChangePasswordModal();
    });

    // Two-Factor Authentication
    const twoFactorBtn = document.getElementById('twoFactorBtn');
    twoFactorBtn.addEventListener('click', function() {
        showTwoFactorModal();
    });

    // Delete Account
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const deleteAccountModal = document.getElementById('deleteAccountModal');
    const closeDeleteModal = document.getElementById('closeDeleteModal');
    const cancelDelete = document.getElementById('cancelDelete');
    const confirmDeleteInput = document.getElementById('confirmDelete');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

    deleteAccountBtn.addEventListener('click', function() {
        deleteAccountModal.style.display = 'flex';
    });

    closeDeleteModal.addEventListener('click', function() {
        deleteAccountModal.style.display = 'none';
        confirmDeleteInput.value = '';
        confirmDeleteBtn.disabled = true;
    });

    cancelDelete.addEventListener('click', function() {
        deleteAccountModal.style.display = 'none';
        confirmDeleteInput.value = '';
        confirmDeleteBtn.disabled = true;
    });

    // Enable delete button only when "DELETE" is typed
    confirmDeleteInput.addEventListener('input', function() {
        confirmDeleteBtn.disabled = this.value !== 'DELETE';
    });

    confirmDeleteBtn.addEventListener('click', function() {
        if (confirmDeleteInput.value === 'DELETE') {
            // Simulate account deletion
            showNotification('Account deletion initiated. You will be logged out shortly.', 'info');
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 3000);
        }
    });

    // Avatar Edit
    const avatarEditBtn = document.getElementById('avatarEditBtn');
    avatarEditBtn.addEventListener('click', function() {
        showAvatarEditModal();
    });

    // Logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Recipe card interactions (same as dashboard)
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        const viewBtn = card.querySelector('.btn-view');
        const editBtn = card.querySelector('.btn-edit');
        const deleteBtn = card.querySelector('.btn-delete');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recipeId = card.getAttribute('data-recipe-id');
                viewRecipe(recipeId);
            });
        }

        if (editBtn) {
            editBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recipeId = card.getAttribute('data-recipe-id');
                editRecipe(recipeId);
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                const recipeId = card.getAttribute('data-recipe-id');
                deleteRecipe(recipeId, card);
            });
        }
    });

    // Favorite removal
    const removeFavoriteBtns = document.querySelectorAll('.btn-remove-favorite');
    removeFavoriteBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const favoriteItem = this.closest('.favorite-item');
            favoriteItem.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                favoriteItem.remove();
                showNotification('Removed from favorites', 'info');
            }, 300);
        });
    });

    // Functions
    function updateProfileDisplay(data) {
        document.getElementById('profileName').textContent = data.name;
        document.getElementById('userName').textContent = data.name;
        document.getElementById('profileTitle').textContent = data.title;
        document.getElementById('profileBio').textContent = data.bio;
    }

    function showChangePasswordModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Change Password</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="changePasswordForm">
                        <div class="form-group">
                            <label for="currentPassword">Current Password</label>
                            <input type="password" id="currentPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="newPassword">New Password</label>
                            <input type="password" id="newPassword" required>
                        </div>
                        <div class="form-group">
                            <label for="confirmNewPassword">Confirm New Password</label>
                            <input type="password" id="confirmNewPassword" required>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                            <button type="submit" class="btn btn-primary">Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#changePasswordForm');

        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword !== confirmPassword) {
                showNotification('Passwords do not match', 'error');
                return;
            }
            
            showNotification('Password changed successfully!', 'success');
            modal.remove();
        });
    }

    function showTwoFactorModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Two-Factor Authentication</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="two-factor-info">
                        <i class="fas fa-shield-alt"></i>
                        <h3>Secure Your Account</h3>
                        <p>Two-factor authentication adds an extra layer of security to your account by requiring a second form of verification.</p>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="button" class="btn btn-primary" id="enableTwoFactor">Enable 2FA</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const enableBtn = modal.querySelector('#enableTwoFactor');

        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        enableBtn.addEventListener('click', () => {
            showNotification('Two-factor authentication enabled!', 'success');
            modal.remove();
        });
    }

    function showAvatarEditModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Change Profile Picture</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="avatar-preview">
                        <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&h=120&fit=crop&crop=face" alt="Current Avatar" id="avatarPreview">
                    </div>
                    <form id="avatarForm">
                        <div class="form-group">
                            <label for="avatarUrl">Image URL</label>
                            <input type="url" id="avatarUrl" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                            <button type="submit" class="btn btn-primary">Update Avatar</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#avatarForm');
        const avatarUrlInput = document.getElementById('avatarUrl');
        const avatarPreview = document.getElementById('avatarPreview');

        closeBtn.addEventListener('click', () => modal.remove());
        cancelBtn.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        avatarUrlInput.addEventListener('input', function() {
            if (this.value) {
                avatarPreview.src = this.value;
            }
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const newAvatarUrl = avatarUrlInput.value;
            
            if (newAvatarUrl) {
                // Update all avatar images
                document.getElementById('profileAvatar').src = newAvatarUrl;
                document.getElementById('profileAvatarLarge').src = newAvatarUrl;
                
                showNotification('Profile picture updated!', 'success');
                modal.remove();
            }
        });
    }

    function viewRecipe(recipeId) {
        // This would use the same function from dashboard-script.js
        showNotification(`Viewing recipe ${recipeId}`, 'info');
    }

    function editRecipe(recipeId) {
        // This would use the same function from dashboard-script.js
        showNotification(`Editing recipe ${recipeId}`, 'info');
    }

    function deleteRecipe(recipeId, cardElement) {
        // This would use the same function from dashboard-script.js
        showNotification(`Deleting recipe ${recipeId}`, 'info');
    }

    function logout() {
        // Show logout confirmation
        const confirmLogout = confirm('Are you sure you want to logout?');
        
        if (confirmLogout) {
            // Clear any stored user data
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('userEmail');
            
            // Show logout notification
            showNotification('Logging out...', 'info');
            
            // Redirect to login page after 1 second
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add notification styles
        const notificationStyles = document.createElement('style');
        notificationStyles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 16px 20px;
                border-radius: 12px;
                color: white;
                z-index: 1001;
                animation: slideInRight 0.3s ease;
                max-width: 300px;
            }
            .notification-success {
                background: #68d391;
            }
            .notification-info {
                background: #4299e1;
            }
            .notification-error {
                background: #f56565;
            }
            .notification-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes fadeOut {
                from { opacity: 1; transform: scale(1); }
                to { opacity: 0; transform: scale(0.8); }
            }
        `;
        document.head.appendChild(notificationStyles);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
            notificationStyles.remove();
        }, 3000);
    }

    // Add fadeOut animation for favorite removal
    const fadeOutStyles = document.createElement('style');
    fadeOutStyles.textContent = `
        @keyframes fadeOut {
            from { opacity: 1; transform: scale(1); }
            to { opacity: 0; transform: scale(0.8); }
        }
    `;
    document.head.appendChild(fadeOutStyles);
});
