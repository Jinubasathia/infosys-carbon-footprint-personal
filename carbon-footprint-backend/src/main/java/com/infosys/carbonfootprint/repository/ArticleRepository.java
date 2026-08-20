package com.infosys.carbonfootprint.repository;
import com.infosys.carbonfootprint.entity.*; import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface ArticleRepository extends JpaRepository<Article,Long> { List<Article> findByStatusAndVisibleToUsersTrueOrderByPublishedAtDesc(ArticleStatus status); }