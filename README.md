

# **Note Vote**

## **Overview**
**Note Vote** is a web application developed as a lab project for **ENSE 374**. It demonstrates a simple note-sharing platform where users can post, upvote, and downvote notes. The app is built using the **MVC (Model-View-Controller)** architecture to ensure a modular and maintainable structure.

This project showcases the integration of modern web development technologies, including **Node.js**, **Express.js**, **MongoDB**, **EJS**, and **Passport.js**, alongside styling frameworks like **Bootstrap**.

---

## **Features**
- **User Authentication:**
  - Secure login and registration using **Passport.js**.
  - Session management via **Express Sessions**.
- **Post Management:**
  - Create, upvote, and downvote notes.
  - Notes are displayed dynamically with voting states.
- **MVC Architecture:**
  - Clearly separated Models, Views, and Controllers for scalability and maintainability.
- **Dynamic Templating:**
  - Views built using **EJS** for server-side rendering.
- **Responsive Design:**
  - Frontend styled with **Bootstrap**, along with custom HTML and CSS.

---

## **Technologies Used**
- **Backend:**
  - Node.js
  - Express.js
  - Passport.js
- **Database:**
  - MongoDB (with Mongoose as the ODM)
- **Frontend:**
  - EJS
  - Bootstrap
  - HTML5, CSS3
- **Authentication:**
  - Passport.js (Local strategy)
  - Express Sessions

---

## **Installation and Setup**
Follow these steps to set up and run the project locally:

### **Prerequisites**
Ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local or cloud-based)
- A modern web browser

### **Steps**
1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/note-vote.git
   cd note-vote
   ```

2. **Install Dependencies**
   Install the required Node.js packages.
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**
   Create a `.env` file in the project root and configure the following:
   ```env
   SECRET=your_session_secret
   INVITE_CODE=your_invite_code
   PORT = 3000 
   ```

4. **Start MongoDB**
   Ensure MongoDB is running on `mongodb://localhost:27017/note-vote`. Update the connection string in the code if using a different setup.

5. **Run the Application**
   ```bash
   node app.js
   ```
   The server will start at `http://localhost:3000`.

---

## **Folder Structure**
The project follows an **MVC architecture**:

```
note-vote/
│
├── controllers/         # Controllers for handling app logic
│   ├── authController.js
│   ├── postController.js
│
├── models/              # Mongoose models for MongoDB
│   ├── UserModel.js
│   ├── PostModel.js
│
├── views/               # EJS templates for rendering pages
│   ├── index.ejs
│   ├── note-vote.ejs
│   └── partials/
|   |     └── node-module.ejs
│   └── layouts/
│         ├── header.ejs
|         └── footer.ejs
|     
│   
|
│
├── public/              # Static files (CSS, JS, Images)
│   ├── css/
|         └── styles.ejs
|
├── .env                 # Environment variables (not in repo)
├── app.js               # Main application file
├── package.json         # Dependency and script management
├── README.md            # Project documentation
```

---

## **Usage**
1. Visit the homepage (`http://localhost:3000`).
2. Register using a valid invite code (defined in `.env`).
3. Log in to access the main **Note Vote** page.
4. Create notes, upvote, or downvote existing notes.

---

## **Authentication**
Authentication is implemented using **Passport.js**:
- Users are authenticated using the **Local Strategy**.
- User sessions are managed via **Express Sessions**.
- Passwords are hashed and stored securely using **passport-local-mongoose**.



## **License**
This project is developed as part of the **ENSE 374** coursework. It is intended for educational purposes.

---

## **Contributors**
- **Hashir Owais**  
  - Software Engineering Student, University of Regina  



