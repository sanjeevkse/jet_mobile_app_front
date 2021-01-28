-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 25, 2020 at 02:35 PM
-- Server version: 10.1.38-MariaDB
-- PHP Version: 7.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `db_logistics`
--

-- --------------------------------------------------------

--
-- Table structure for table `tbl_container`
--

CREATE TABLE `tbl_container` (
  `id` int(11) NOT NULL,
  `item_name` text NOT NULL,
  `item_size` decimal(10,2) NOT NULL,
  `item_capacity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_firm`
--

CREATE TABLE `tbl_firm` (
  `id` int(11) NOT NULL,
  `item_name` text NOT NULL,
  `disp_name` text NOT NULL,
  `address` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_place`
--

CREATE TABLE `tbl_place` (
  `id` int(11) NOT NULL,
  `category` enum('SOURCE','DESTINATION') NOT NULL,
  `item_name` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_place`
--

INSERT INTO `tbl_place` (`id`, `category`, `item_name`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`) VALUES
(1, 'SOURCE', 'dasfsdvgg', '2020-03-25 18:53:42', 0, '2020-03-25 18:54:35', 0, 1),
(2, 'DESTINATION', 'fdfd', '2020-03-25 18:53:45', 0, '2020-03-25 18:53:45', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user`
--

CREATE TABLE `tbl_user` (
  `id` int(11) NOT NULL,
  `full_name` text NOT NULL,
  `username` text NOT NULL,
  `password` text NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) NOT NULL,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_by` int(11) NOT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user`
--

INSERT INTO `tbl_user` (`id`, `full_name`, `username`, `password`, `created_at`, `created_by`, `updated_at`, `updated_by`, `status`) VALUES
(1, 'Admin', 'admin', 'admin', '2020-03-25 16:31:21', 0, '2020-03-25 16:31:21', 0, 1),
(2, 'asf', 'sadfs', 'dasf', '2020-03-25 18:42:46', 0, '2020-03-25 18:44:21', 0, 1),
(3, 'asdfddd', 'dsaf', 'dsaf', '2020-03-25 18:43:34', 0, '2020-03-25 18:44:17', 0, 1);

-- --------------------------------------------------------

--
-- Table structure for table `tbl_user_login`
--

CREATE TABLE `tbl_user_login` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `user_agent` text NOT NULL,
  `token` char(16) NOT NULL,
  `token_expire` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `tbl_user_login`
--

INSERT INTO `tbl_user_login` (`id`, `user_id`, `user_agent`, `token`, `token_expire`, `created_at`, `updated_at`, `status`) VALUES
(1, 1, '', 'e79184bc3f6167a9', '2020-03-25 18:01:30', '2020-03-25 17:01:30', '2020-03-25 17:01:30', 1),
(2, 1, '', '578c7c8fcca95e23', '2020-03-25 18:03:08', '2020-03-25 17:03:08', '2020-03-25 17:03:08', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_container`
--
ALTER TABLE `tbl_container`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_firm`
--
ALTER TABLE `tbl_firm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_place`
--
ALTER TABLE `tbl_place`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user`
--
ALTER TABLE `tbl_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tbl_user_login`
--
ALTER TABLE `tbl_user_login`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_container`
--
ALTER TABLE `tbl_container`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_firm`
--
ALTER TABLE `tbl_firm`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_place`
--
ALTER TABLE `tbl_place`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tbl_user`
--
ALTER TABLE `tbl_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbl_user_login`
--
ALTER TABLE `tbl_user_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
