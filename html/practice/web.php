<?php
// Database connection info
$servername = "127.0.0.1";
$username = "root";
$password = "mysql@123";
$dbname = "php";
$port = 33066;

$conn = new mysqli($servername, $username, $password, $dbname, $port);


// Check connection
if ($conn->connect_error) {
    die("<h2 style='color:red;'>❌ Connection failed: " . $conn->connect_error . "</h2>");
}

// Create table if not exists
$table_sql = "CREATE TABLE IF NOT EXISTS feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    rating INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";
$conn->query($table_sql);

// Handle form submission
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = htmlspecialchars(trim($_POST['name']));
    $email = htmlspecialchars(trim($_POST['email']));
    $message = htmlspecialchars(trim($_POST['message']));
    $rating = htmlspecialchars(trim($_POST['rating']));

    if (empty($name) || empty($email) || empty($message) || empty($rating)) {
        echo "<h2 style='color:red;'>⚠️ Please fill out all fields.</h2>";
    } else {
        $stmt = $conn->prepare("INSERT INTO feedback (name, email, message, rating) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("sssi", $name, $email, $message, $rating);

        if ($stmt->execute()) {
            echo "<h2 style='color:green;'>✅ Feedback submitted successfully!</h2>";
            echo "<p><strong>Name:</strong> $name</p>";
            echo "<p><strong>Email:</strong> $email</p>";
            echo "<p><strong>Message:</strong> $message</p>";
            echo "<p><strong>Rating:</strong> $rating / 5</p>";
        } else {
            echo "<h2 style='color:red;'>❌ Error: " . $stmt->error . "</h2>";
        }
        $stmt->close();
    }
}
echo "Connected to MySQL server: " . $conn->host_info;

$conn->close();
?>
