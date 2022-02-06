-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 06, 2022 at 07:24 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rcg`
--

-- --------------------------------------------------------

--
-- Table structure for table `employee`
--

CREATE TABLE `employee` (
  `person_id` int(7) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `last_name` varchar(50) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `hire_date` date NOT NULL,
  `job_title` varchar(100) NOT NULL,
  `agency_num` int(11) DEFAULT NULL,
  `registration_date` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `employee`
--

INSERT INTO `employee` (`person_id`, `first_name`, `last_name`, `email_address`, `hire_date`, `job_title`, `agency_num`, `registration_date`) VALUES
(1000000, 'Tony', 'Stark', 'tstark@rccl.org', '2008-05-02', 'Direct Rep A', 123456789, '2022-02-06'),
(1000001, 'Steve', 'Rogers', 'sroger@rccl.org', '2011-07-22', 'Direct Rep B', 123456789, '2022-02-06'),
(1000002, 'Thor', 'Odinson', 'todinson@rccl.org', '2011-05-06', 'TA Rep A', NULL, '2022-02-06'),
(1000003, 'Bruce', 'Banner', 'bbanner@rccl.org', '2008-06-13', 'TA Rep B', NULL, '2022-02-06');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `employee`
--
ALTER TABLE `employee`
  ADD PRIMARY KEY (`person_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
