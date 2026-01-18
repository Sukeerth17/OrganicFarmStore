-- =====================================
-- Seed data for products and a test user
-- =====================================

-- Insert initial products (use ON CONFLICT DO NOTHING in case seed is re-run)
INSERT INTO products (name, price, unit, image, category)
VALUES
('Premium Alphonso Mango', 450, 'kg', 'https://media.licdn.com/dms/image/v2/D5622AQFKMBvSqh_rbA/feedshare-shrink_800/feedshare-shrink_800/0/1724244002416?e=2147483647&v=beta&t=V_bt7AEkpAJi8zQffPjC_cZuRVej7hqZmcBjKQJfo-0', 'Fruits'),
('Organic Red Apples', 250, 'kg', 'https://i.pinimg.com/736x/68/46/70/684670e508cb9ac6c402edacb9f2fb48.jpg', 'Fruits'),
('Fresh Green Grapes', 180, 'kg', 'https://i.pinimg.com/1200x/47/ea/3b/47ea3bf2b1e971ad7e784f3fd1253db8.jpg', 'Fruits'),
('Sweet Strawberries', 320, 'kg', 'https://images.unsplash.com/photo-1543528176-61b239494933?w=800&h=800&fit=crop&q=90', 'Fruits'),
('Farm Fresh Tomatoes', 80, 'kg', 'https://i.pinimg.com/736x/df/58/c4/df58c4142e111d5ca439206447c5b0d4.jpg', 'Vegetables'),
('Organic Carrots', 60, 'kg', 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=800&h=800&fit=crop&q=90', 'Vegetables'),
('Fresh Spinach Bunch', 40, 'bunch', 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=800&fit=crop&q=90', 'Vegetables'),
('Ripe Bananas', 50, 'dozen', 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&h=800&fit=crop&q=90', 'Fruits'),
('Sweet Oranges', 120, 'kg', 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&h=800&fit=crop&q=90', 'Fruits'),
('Fresh Bell Peppers', 90, 'kg', 'https://i.pinimg.com/1200x/c4/89/d7/c489d7627b31f4c386c4803a3da262f7.jpg', 'Vegetables'),
('Organic Broccoli', 100, 'kg', 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=800&h=800&fit=crop&q=90', 'Vegetables'),
('Sweet Watermelon', 70, 'kg', 'https://i.pinimg.com/1200x/1d/01/ae/1d01aeebde458c69892b9aaa73690adc.jpg', 'Fruits')
ON CONFLICT (name, unit) DO NOTHING;

-- Insert test user (plaintext password for dev only)
INSERT INTO users (name, phone, password)
VALUES ('Test User', '9876543210', 'test123')
ON CONFLICT (phone) DO NOTHING;
