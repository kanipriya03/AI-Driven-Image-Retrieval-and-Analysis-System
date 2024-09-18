// import React, { useState } from 'react';
// import { Link } from 'react-router-dom'; // Import Link from react-router-dom
// import './Sidebar.css';
// import { FaHome, FaImage, FaUserFriends } from 'react-icons/fa';
// import { BiMenu } from 'react-icons/bi';

// const Sidebar = () => {
//     const [isCollapsed, setIsCollapsed] = useState(true);

//     const toggleSidebar = () => {
//         setIsCollapsed(!isCollapsed);
//     };

//     return (
//         <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
//             <div className="menu-container">
//                 <div className="menu-icon" onClick={toggleSidebar}>
//                     <BiMenu size={30} />
//                 </div>
//                 <div className="menu-items">
//                     <Link to="/" className="menu-item">
//                         <FaHome size={20} />
//                         {!isCollapsed && <span>Home</span>}
//                     </Link>
//                     <div className="menu-item">
//                         <FaImage size={20} />
//                         {!isCollapsed && <span>Images</span>}
//                     </div>
//                     <div className="menu-item">
//                         <FaUserFriends size={20} />
//                         {!isCollapsed && <span>Faces</span>}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Sidebar;


import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './Sidebar.css';
import { FaHome, FaImage, FaUserFriends } from 'react-icons/fa';
import { BiMenu } from 'react-icons/bi';

const Sidebar = () => {
    const [isCollapsed, setIsCollapsed] = useState(true);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="menu-container">
                <div className="menu-icon" onClick={toggleSidebar}>
                    <BiMenu size={30} />
                </div>
                <div className="menu-items">
                    <Link to="/" className="menu-item">
                        <FaHome size={20} />
                        {!isCollapsed && <span>Home</span>}
                    </Link>
                    <Link to="/images" className="menu-item">
                        <FaImage size={20} />
                        {!isCollapsed && <span>Images</span>}
                    </Link>
                    <Link to="/faces" className="menu-item">
                        <FaUserFriends size={20} />
                        {!isCollapsed && <span>Faces</span>}
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
