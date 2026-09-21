-- =====================================================
-- HOTEL 2
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Grand Palace Hotel',
  'Sheikh Zayed Road',
  'Dubai',
  245,
  299,
  '4.8',
  'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop',
  'A luxurious hotel offering elegant rooms, excellent service, and convenient access to the city.',
  1
)
RETURNING id;

-- Add exactly 4 images
INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1595576508898-0ad5c879a061?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);


-- =====================================================
-- HOTEL 3
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Ocean View Resort',
  'Palm Jumeirah',
  'Dubai',
  318,
  450,
  '4.9',
  'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop',
  'A beautiful resort with stunning views, spacious rooms, and premium facilities.',
  1
)
RETURNING id;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);


-- =====================================================
-- HOTEL 4
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Royal Grand Hotel',
  'Downtown Boulevard',
  'London',
  189,
  350,
  '4.7',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop',
  'A stylish city hotel combining modern comfort with excellent hospitality.',
  1
)
RETURNING id;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1568084680786-a84f91d1153c?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1601918774946-25832a4be0d6?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);


-- =====================================================
-- HOTEL 5
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Luxury Garden Hotel',
  'Orchard Road',
  'Singapore',
  276,
  280,
  '4.8',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop',
  'A peaceful luxury hotel surrounded by beautiful spaces and modern amenities.',
  1
)
RETURNING id;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);


-- =====================================================
-- HOTEL 6
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Harbor View Hotel',
  'Marina Bay',
  'Singapore',
  221,
  320,
  '4.6',
  'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop',
  'A comfortable waterfront hotel offering relaxing rooms and beautiful city views.',
  1
)
RETURNING id;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1563911302283-d2bc129e7570?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1517840901100-8179e982acb7?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);


-- =====================================================
-- HOTEL 7
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Central Park Hotel',
  'Fifth Avenue',
  'New York',
  354,
  390,
  '4.9',
  'https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=1200&auto=format&fit=crop',
  'A premium hotel in the heart of the city with stylish rooms and exceptional service.',
  1
)
RETURNING id;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1562790351-d273a961e0e9?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1559599238-308793637427?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1590490359683-658d3d23f972?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);


-- =====================================================
-- HOTEL 8
-- =====================================================

INSERT INTO hotels (
  name,
  address,
  location,
  reviews,
  price,
  rate,
  image,
  description,
  owner_id
)
VALUES (
  'Metropolitan Suites',
  'Park Avenue',
  'New York',
  298,
  420,
  '4.8',
  'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1200&auto=format&fit=crop',
  'Modern suites offering spacious accommodation, premium comfort, and a convenient city location.',
  1
)
RETURNING id;

INSERT INTO hotel_images (hotel_id, image_url)
SELECT
  currval(pg_get_serial_sequence('hotels', 'id')),
  image_url
FROM (
  VALUES
    ('https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1535827841776-24afc1e255ac?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1200&auto=format&fit=crop'),
    ('https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=1200&auto=format&fit=crop')
) AS images(image_url);