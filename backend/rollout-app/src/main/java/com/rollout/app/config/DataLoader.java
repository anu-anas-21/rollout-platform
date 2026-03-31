package com.rollout.app.config;

import com.rollout.app.entity.*;
import com.rollout.app.repository.EventRepository;
import com.rollout.app.repository.ProductRepository;
import com.rollout.app.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final ProductRepository productRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    @Bean
    CommandLineRunner seedData() {
        return args -> {
            // Ensure demo users always exist (even if other users already exist).
            userRepository.findByEmail("admin@rollout.cafe")
                    .orElseGet(() -> userRepository.save(User.builder()
                            .email("admin@rollout.cafe")
                            .password("admin123")
                            .role(UserRole.ADMIN)
                            .build()));

            userRepository.findByEmail("demo@rollout.cafe")
                    .orElseGet(() -> userRepository.save(User.builder()
                            .email("demo@rollout.cafe")
                            .password("demo123")
                            .role(UserRole.USER)
                            .build()));

            if (productRepository.count() == 0) {
                productRepository.save(Product.builder()
                        .name("Espresso")
                        .description("Double shot, locally roasted beans.")
                        .price(new BigDecimal("3.50"))
                        .category(ProductCategory.COFFEE)
                        .imageUrl("https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80")
                        .build());
                productRepository.save(Product.builder()
                        .name("Oat Flat White")
                        .description("Silky microfoam with oat milk.")
                        .price(new BigDecimal("4.75"))
                        .category(ProductCategory.COFFEE)
                        .imageUrl("https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=80")
                        .build());
                productRepository.save(Product.builder()
                        .name("Avocado Toast")
                        .description("Sourdough, smashed avo, chili flakes.")
                        .price(new BigDecimal("9.00"))
                        .category(ProductCategory.FOOD)
                        .imageUrl("https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1200&q=80")
                        .build());
                productRepository.save(Product.builder()
                        .name("Energy Bar")
                        .description("Dates, nuts, dark chocolate — ride fuel.")
                        .price(new BigDecimal("2.50"))
                        .category(ProductCategory.NUTRITION)
                        .imageUrl("https://images.unsplash.com/photo-1622480916113-8f6f03cb4a3f?auto=format&fit=crop&w=1200&q=80")
                        .build());
                productRepository.save(Product.builder()
                        .name("Cycling Gloves")
                        .description("Padded palms, breathable mesh.")
                        .price(new BigDecimal("29.99"))
                        .category(ProductCategory.CYCLING_GEAR)
                        .imageUrl("https://images.unsplash.com/photo-1610384104075-e05c5e95d307?auto=format&fit=crop&w=1200&q=80")
                        .build());
                productRepository.save(Product.builder()
                        .name("Club Jersey")
                        .description("RollOut team jersey, moisture-wicking.")
                        .price(new BigDecimal("65.00"))
                        .category(ProductCategory.APPAREL)
                        .imageUrl("https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&w=1200&q=80")
                        .build());
            }

            if (eventRepository.count() == 0) {
                eventRepository.save(EventEntity.builder()
                        .title("Saturday Social Ride")
                        .description("Easy 40 km loop, coffee stop at the café.")
                        .date(LocalDateTime.now().plusDays(10).withHour(8).withMinute(0))
                        .location("RollOut Café — meet at the patio")
                        .build());
                eventRepository.save(EventEntity.builder()
                        .title("Latte Art Workshop")
                        .description("Learn basics with our head barista.")
                        .date(LocalDateTime.now().plusDays(24).withHour(17).withMinute(30))
                        .location("RollOut Café")
                        .build());
            }
        };
    }
}
