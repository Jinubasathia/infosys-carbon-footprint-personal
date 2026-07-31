package com.infosys.carbonfootprint.service.impl;

import com.infosys.carbonfootprint.dto.UserDetailDto;
import com.infosys.carbonfootprint.entity.User;
import com.infosys.carbonfootprint.exception.ResourceNotFoundException;
import com.infosys.carbonfootprint.mapper.UserMapper;
import com.infosys.carbonfootprint.repository.UserRepository;
import com.infosys.carbonfootprint.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional(readOnly = true)
    public UserDetailDto getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return userMapper.toDetailDto(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetailDto getUserProfileByUsername(String username) {
        User user = userRepository.findByUsernameOrEmail(username, username)
                .orElseThrow(() -> new ResourceNotFoundException("User", "username/email", username));
        return userMapper.toDetailDto(user);
    }
}
