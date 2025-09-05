document.addEventListener('DOMContentLoaded', function() {
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    const recipeCards = document.querySelectorAll('.recipe-card');
    const categoryCards = document.querySelectorAll('.category-card');

    // Search recipes and categories
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        // Search recipes
        recipeCards.forEach(card => {
            const recipeTitle = card.querySelector('h3').textContent.toLowerCase();
            const recipeSection = card.closest('.recipes-section');
            
            if (recipeTitle.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = searchTerm ? 'none' : 'block';
            }
        });

        // Search categories
        categoryCards.forEach(card => {
            const categoryTitle = card.querySelector('h3').textContent.toLowerCase();
            
            if (categoryTitle.includes(searchTerm)) {
                card.style.display = 'block';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = searchTerm ? 'none' : 'block';
            }
        });

        // Show/hide section headers based on results
        const recipesSection = document.querySelector('.recipes-section');
        const categoriesSection = document.querySelector('.categories-section');
        
        if (searchTerm) {
            const visibleRecipes = Array.from(recipeCards).filter(card => card.style.display !== 'none');
            const visibleCategories = Array.from(categoryCards).filter(card => card.style.display !== 'none');
            
            if (visibleRecipes.length === 0) {
                recipesSection.style.display = 'none';
            } else {
                recipesSection.style.display = 'block';
            }
            
            if (visibleCategories.length === 0) {
                categoriesSection.style.display = 'none';
            } else {
                categoriesSection.style.display = 'block';
            }
        } else {
            recipesSection.style.display = 'block';
            categoriesSection.style.display = 'block';
        }
    });

    // Add new recipe button functionality
    const addRecipeBtn = document.querySelector('.welcome-card .btn-primary');
    addRecipeBtn.addEventListener('click', function() {
        showAddRecipeModal();
    });

    // Recipe card interactions
    recipeCards.forEach(card => {
        const viewBtn = card.querySelector('.btn-view');
        const editBtn = card.querySelector('.btn-edit');
        const deleteBtn = card.querySelector('.btn-delete');
        const favoriteBtn = card.querySelector('.btn-favorite');
        const shareBtn = card.querySelector('.btn-share');
        
        // View button
        viewBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const recipeId = card.getAttribute('data-recipe-id');
            viewRecipe(recipeId);
        });

        // Edit button
        editBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const recipeId = card.getAttribute('data-recipe-id');
            editRecipe(recipeId);
        });

        // Delete button
        deleteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const recipeId = card.getAttribute('data-recipe-id');
            deleteRecipe(recipeId, card);
        });

        // Heart button (favorite)
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(this);
        });

        // Share button
        shareBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            shareRecipe(card);
        });
    });

    // Category card interactions
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('h3').textContent;
            filterByCategory(categoryName);
        });
    });

    // User menu dropdown and logout functionality
    const userMenu = document.querySelector('.user-menu');
    const logoutBtn = document.getElementById('logoutBtn');
    
    userMenu.addEventListener('click', function() {
        showUserDropdown();
    });

    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
    });

    // Stats animation on load
    animateStats();

    // Functions
    function toggleFavorite(heartBtn) {
        const icon = heartBtn.querySelector('i');
        const isFavorited = icon.classList.contains('fas');
        
        if (isFavorited) {
            icon.classList.remove('fas');
            icon.classList.add('far');
            heartBtn.style.color = '#4a5568';
            showNotification('Removed from favorites', 'info');
        } else {
            icon.classList.remove('far');
            icon.classList.add('fas');
            heartBtn.style.color = '#e53e3e';
            showNotification('Added to favorites', 'success');
        }
    }

    function shareRecipe(recipeCard) {
        const recipeTitle = recipeCard.querySelector('h3').textContent;
        
        if (navigator.share) {
            navigator.share({
                title: recipeTitle,
                text: `Check out this amazing recipe: ${recipeTitle}`,
                url: window.location.href
            });
        } else {
            // Fallback for browsers that don't support Web Share API
            const shareText = `Check out this amazing recipe: ${recipeTitle}`;
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Recipe link copied to clipboard!', 'success');
            });
        }
    }

    function viewRecipe(recipeId) {
        const recipeData = getRecipeData(recipeId);
        showRecipeModal(recipeData, 'view');
    }

    function editRecipe(recipeId) {
        const recipeData = getRecipeData(recipeId);
        showRecipeModal(recipeData, 'edit');
    }

    function deleteRecipe(recipeId, cardElement) {
        const recipeData = getRecipeData(recipeId);
        
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal-overlay';
        confirmModal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Delete Recipe</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>Are you sure you want to delete "<strong>${recipeData.name}</strong>"?</p>
                    <p class="text-muted">This action cannot be undone.</p>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                        <button type="button" class="btn btn-danger modal-confirm">Delete Recipe</button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles if not already present
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 {
                    margin: 0;
                    color: #2d3748;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #a0aec0;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .text-muted {
                    color: #718096;
                    font-size: 14px;
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 1.5rem;
                }
                .btn-danger {
                    background: #e53e3e;
                    color: white;
                }
                .btn-danger:hover {
                    background: #c53030;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(modalStyles);
        }

        document.body.appendChild(confirmModal);

        // Modal event listeners
        const closeBtn = confirmModal.querySelector('.modal-close');
        const cancelBtn = confirmModal.querySelector('.modal-cancel');
        const confirmBtn = confirmModal.querySelector('.modal-confirm');

        closeBtn.addEventListener('click', () => closeModal(confirmModal));
        cancelBtn.addEventListener('click', () => closeModal(confirmModal));
        confirmModal.addEventListener('click', (e) => {
            if (e.target === confirmModal) closeModal(confirmModal);
        });

        confirmBtn.addEventListener('click', () => {
            // Remove the recipe card with animation
            cardElement.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                cardElement.remove();
                updateStats();
                showNotification(`"${recipeData.name}" has been deleted`, 'success');
                closeModal(confirmModal);
            }, 300);
        });
    }

    function getRecipeData(recipeId) {
        const recipes = {
            '1': {
                id: 1,
                name: 'Creamy Garlic Pasta',
                description: 'A rich and creamy pasta dish with aromatic garlic and parmesan cheese.',
                time: 25,
                servings: 4,
                difficulty: 'Easy',
                rating: 4.9,
                image: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=300&h=200&fit=crop',
                ingredients: [
                    '400g pasta',
                    '4 cloves garlic',
                    '200ml heavy cream',
                    '100g parmesan cheese',
                    '2 tbsp butter',
                    'Salt and pepper to taste',
                    'Fresh parsley for garnish'
                ],
                instructions: [
                    'Cook pasta according to package instructions',
                    'Heat butter in a large pan over medium heat',
                    'Add minced garlic and cook until fragrant',
                    'Pour in heavy cream and bring to a simmer',
                    'Add grated parmesan cheese and stir until melted',
                    'Season with salt and pepper',
                    'Toss cooked pasta with the sauce',
                    'Garnish with fresh parsley and serve'
                ]
            },
            '2': {
                id: 2,
                name: 'Mediterranean Salad',
                description: 'Fresh vegetables with olives, feta cheese, and a light vinaigrette dressing.',
                time: 15,
                servings: 2,
                difficulty: 'Easy',
                rating: 4.6,
                image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop',
                ingredients: [
                    'Mixed greens',
                    'Cherry tomatoes',
                    'Cucumber',
                    'Red onion',
                    'Kalamata olives',
                    'Feta cheese',
                    'Olive oil',
                    'Lemon juice',
                    'Oregano'
                ],
                instructions: [
                    'Wash and chop all vegetables',
                    'Combine greens, tomatoes, cucumber, and onion',
                    'Add olives and crumbled feta cheese',
                    'Whisk together olive oil and lemon juice',
                    'Drizzle dressing over salad',
                    'Sprinkle with oregano and serve'
                ]
            },
            '3': {
                id: 3,
                name: 'Fluffy Pancakes',
                description: 'Light and airy pancakes perfect for breakfast with maple syrup and butter.',
                time: 20,
                servings: 3,
                difficulty: 'Easy',
                rating: 4.8,
                image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300&h=200&fit=crop',
                ingredients: [
                    '2 cups all-purpose flour',
                    '2 tbsp sugar',
                    '2 tsp baking powder',
                    '1/2 tsp salt',
                    '2 eggs',
                    '1 3/4 cups milk',
                    '1/4 cup melted butter',
                    'Vanilla extract'
                ],
                instructions: [
                    'Mix dry ingredients in a large bowl',
                    'Whisk eggs, milk, butter, and vanilla',
                    'Pour wet ingredients into dry ingredients',
                    'Stir until just combined',
                    'Heat griddle over medium heat',
                    'Pour batter onto griddle',
                    'Cook until bubbles form and edges are dry',
                    'Flip and cook until golden brown'
                ]
            },
            '4': {
                id: 4,
                name: 'Gourmet Burger',
                description: 'Juicy beef patty with fresh vegetables, cheese, and special sauce on a brioche bun.',
                time: 35,
                servings: 2,
                difficulty: 'Medium',
                rating: 4.7,
                image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=300&h=200&fit=crop',
                ingredients: [
                    '500g ground beef',
                    '2 brioche buns',
                    'Lettuce',
                    'Tomato',
                    'Red onion',
                    'Cheddar cheese',
                    'Special sauce',
                    'Salt and pepper'
                ],
                instructions: [
                    'Season ground beef with salt and pepper',
                    'Form into patties',
                    'Cook patties on grill or pan',
                    'Toast brioche buns',
                    'Assemble burger with all ingredients',
                    'Add special sauce',
                    'Serve immediately'
                ]
            }
        };
        return recipes[recipeId];
    }

    function filterByCategory(categoryName) {
        showNotification(`Filtering by category: ${categoryName}`, 'info');
        // Here you would typically filter the recipes by category
        // For now, we'll just show a notification
    }

    function showAddRecipeModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2>Add New Recipe</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="addRecipeForm">
                        <div class="form-group">
                            <label for="recipeName">Recipe Name</label>
                            <input type="text" id="recipeName" required>
                        </div>
                        <div class="form-group">
                            <label for="recipeDescription">Description</label>
                            <textarea id="recipeDescription" rows="3"></textarea>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="recipeTime">Cooking Time (minutes)</label>
                                <input type="number" id="recipeTime" required>
                            </div>
                            <div class="form-group">
                                <label for="recipeServings">Servings</label>
                                <input type="number" id="recipeServings" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="recipeDifficulty">Difficulty</label>
                            <select id="recipeDifficulty" required>
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="recipeImage">Image URL</label>
                            <input type="url" id="recipeImage" placeholder="https://example.com/image.jpg">
                        </div>
                        <div class="form-group">
                            <label for="recipeIngredients">Ingredients (one per line)</label>
                            <textarea id="recipeIngredients" rows="5" placeholder="400g pasta&#10;4 cloves garlic&#10;200ml heavy cream"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="recipeInstructions">Instructions (one per line)</label>
                            <textarea id="recipeInstructions" rows="5" placeholder="Cook pasta according to package instructions&#10;Heat butter in a large pan"></textarea>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                            <button type="submit" class="btn btn-primary">Add Recipe</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        addModalStyles();
        document.body.appendChild(modal);

        // Modal event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const form = modal.querySelector('#addRecipeForm');

        closeBtn.addEventListener('click', () => closeModal(modal));
        cancelBtn.addEventListener('click', () => closeModal(modal));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            showNotification('Recipe added successfully!', 'success');
            closeModal(modal);
        });
    }

    function showRecipeModal(recipeData, mode = 'view') {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        
        const isEditMode = mode === 'edit';
        const modalTitle = isEditMode ? 'Edit Recipe' : 'Recipe Details';
        
        modal.innerHTML = `
            <div class="modal-content large-modal">
                <div class="modal-header">
                    <h2>${modalTitle}</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    ${isEditMode ? `
                        <form id="editRecipeForm">
                            <div class="form-group">
                                <label for="editRecipeName">Recipe Name</label>
                                <input type="text" id="editRecipeName" value="${recipeData.name}" required>
                            </div>
                            <div class="form-group">
                                <label for="editRecipeDescription">Description</label>
                                <textarea id="editRecipeDescription" rows="3">${recipeData.description}</textarea>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="editRecipeTime">Cooking Time (minutes)</label>
                                    <input type="number" id="editRecipeTime" value="${recipeData.time}" required>
                                </div>
                                <div class="form-group">
                                    <label for="editRecipeServings">Servings</label>
                                    <input type="number" id="editRecipeServings" value="${recipeData.servings}" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="editRecipeDifficulty">Difficulty</label>
                                <select id="editRecipeDifficulty" required>
                                    <option value="Easy" ${recipeData.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                                    <option value="Medium" ${recipeData.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                                    <option value="Hard" ${recipeData.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="editRecipeImage">Image URL</label>
                                <input type="url" id="editRecipeImage" value="${recipeData.image}">
                            </div>
                            <div class="form-group">
                                <label for="editRecipeIngredients">Ingredients (one per line)</label>
                                <textarea id="editRecipeIngredients" rows="5">${recipeData.ingredients.join('\n')}</textarea>
                            </div>
                            <div class="form-group">
                                <label for="editRecipeInstructions">Instructions (one per line)</label>
                                <textarea id="editRecipeInstructions" rows="5">${recipeData.instructions.join('\n')}</textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" class="btn btn-secondary modal-cancel">Cancel</button>
                                <button type="submit" class="btn btn-primary">Update Recipe</button>
                            </div>
                        </form>
                    ` : `
                        <div class="recipe-detail">
                            <div class="recipe-detail-image">
                                <img src="${recipeData.image}" alt="${recipeData.name}">
                            </div>
                            <div class="recipe-detail-content">
                                <h3>${recipeData.name}</h3>
                                <p class="recipe-detail-description">${recipeData.description}</p>
                                <div class="recipe-detail-meta">
                                    <span><i class="fas fa-clock"></i> ${recipeData.time} min</span>
                                    <span><i class="fas fa-users"></i> ${recipeData.servings} servings</span>
                                    <span><i class="fas fa-fire"></i> ${recipeData.difficulty}</span>
                                    <span><i class="fas fa-star"></i> ${recipeData.rating}</span>
                                </div>
                                <div class="recipe-detail-section">
                                    <h4>Ingredients</h4>
                                    <ul>
                                        ${recipeData.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                                    </ul>
                                </div>
                                <div class="recipe-detail-section">
                                    <h4>Instructions</h4>
                                    <ol>
                                        ${recipeData.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
                                    </ol>
                                </div>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `;

        addModalStyles();
        document.body.appendChild(modal);

        // Modal event listeners
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        
        closeBtn.addEventListener('click', () => closeModal(modal));
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => closeModal(modal));
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });

        if (isEditMode) {
            const form = modal.querySelector('#editRecipeForm');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                showNotification(`"${recipeData.name}" has been updated!`, 'success');
                closeModal(modal);
            });
        }
    }

    function addModalStyles() {
        if (!document.querySelector('#modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    animation: fadeIn 0.3s ease;
                }
                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: slideIn 0.3s ease;
                }
                .large-modal {
                    max-width: 800px;
                }
                .modal-header {
                    padding: 1.5rem;
                    border-bottom: 1px solid #e2e8f0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h2 {
                    margin: 0;
                    color: #2d3748;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #a0aec0;
                }
                .modal-body {
                    padding: 1.5rem;
                }
                .form-group {
                    margin-bottom: 1rem;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }
                .form-group label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                    color: #4a5568;
                }
                .form-group input,
                .form-group textarea,
                .form-group select {
                    width: 100%;
                    padding: 12px;
                    border: 1px solid #e2e8f0;
                    border-radius: 8px;
                    font-size: 14px;
                }
                .form-group input:focus,
                .form-group textarea:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #68d391;
                    box-shadow: 0 0 0 3px rgba(104, 211, 145, 0.1);
                }
                .form-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: flex-end;
                    margin-top: 1.5rem;
                }
                .btn-danger {
                    background: #e53e3e;
                    color: white;
                }
                .btn-danger:hover {
                    background: #c53030;
                }
                .text-muted {
                    color: #718096;
                    font-size: 14px;
                }
                .recipe-detail {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                }
                .recipe-detail-image {
                    width: 100%;
                    height: 200px;
                    border-radius: 12px;
                    overflow: hidden;
                }
                .recipe-detail-image img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .recipe-detail-content h3 {
                    font-size: 24px;
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                }
                .recipe-detail-description {
                    color: #718096;
                    margin-bottom: 1rem;
                }
                .recipe-detail-meta {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }
                .recipe-detail-meta span {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: #4a5568;
                    font-size: 14px;
                }
                .recipe-detail-section {
                    margin-bottom: 1.5rem;
                }
                .recipe-detail-section h4 {
                    color: #2d3748;
                    margin-bottom: 0.5rem;
                    font-size: 18px;
                }
                .recipe-detail-section ul,
                .recipe-detail-section ol {
                    padding-left: 1.5rem;
                }
                .recipe-detail-section li {
                    margin-bottom: 0.5rem;
                    color: #4a5568;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideIn {
                    from { transform: translateY(-20px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(0.8); }
                }
            `;
            document.head.appendChild(modalStyles);
        }
    }

    function closeModal(modal) {
        modal.remove();
    }

    function updateStats() {
        const remainingRecipes = document.querySelectorAll('.recipe-card').length;
        const totalRecipesElement = document.querySelector('.stat-card .stat-content h3');
        if (totalRecipesElement) {
            totalRecipesElement.textContent = remainingRecipes;
        }
    }

    function showUserDropdown() {
        // Simple user dropdown functionality
        showNotification('User menu clicked', 'info');
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

    function animateStats() {
        const statNumbers = document.querySelectorAll('.stat-content h3');
        
        statNumbers.forEach(stat => {
            const finalValue = parseInt(stat.textContent);
            let currentValue = 0;
            const increment = finalValue / 50;
            
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= finalValue) {
                    stat.textContent = finalValue;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(currentValue);
                }
            }, 30);
        });
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
        `;
        document.head.appendChild(notificationStyles);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
            notificationStyles.remove();
        }, 3000);
    }

    // Add fadeIn animation for search results
    const fadeInStyles = document.createElement('style');
    fadeInStyles.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(fadeInStyles);
});
