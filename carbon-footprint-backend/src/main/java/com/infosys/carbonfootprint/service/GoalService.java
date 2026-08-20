package com.infosys.carbonfootprint.service;
import com.infosys.carbonfootprint.dto.*; import java.util.*;
public interface GoalService { GoalDto current(Long userId); GoalDto save(Long userId,GoalRequest request); GoalDto update(Long userId,Long goalId,GoalRequest request); List<GoalDto> history(Long userId); }